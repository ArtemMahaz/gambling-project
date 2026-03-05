<?php

namespace App\Http\Controllers;

use App\Models\Bet;
use App\Models\Game;
use App\Services\GameService;
use App\Services\WalletService;
use Illuminate\Http\Request;

class BetController extends Controller
{
    protected GameService $gameService;
    protected WalletService $walletService;

    public function __construct(GameService $gameService, WalletService $walletService)
    {
        $this->gameService = $gameService;
        $this->walletService = $walletService;
    }

    public function play(Request $request, string $slug)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'choice' => 'required|string',
        ]);

        $game = Game::where('slug', $slug)->where('is_active', true)->firstOrFail();
        $user = $request->user();
        $amount = $request->amount;
        $choice = $request->choice;

        if ($amount < $game->min_bet || $amount > $game->max_bet) {
            return response()->json([
                'message' => "Bet must be between {$game->min_bet} and {$game->max_bet}",
            ], 422);
        }

        if ($user->wallet->balance < $amount) {
            return response()->json([
                'message' => 'Insufficient balance',
            ], 422);
        }

        $service = $this->gameService->resolve($game);
        if (!$service->validateChoice($choice)) {
            return response()->json([
                'message' => 'Invalid choice for this game',
            ], 422);
        }

        $this->walletService->placeBet($user, $amount);

        $gameResult = $service->play($choice);

        $payout = 0;
        if ($gameResult['won']) {
            $multiplier = $game->multiplier;
            if (isset($gameResult['multiplier_bonus'])) {
                $multiplier *= $gameResult['multiplier_bonus'];
            }
            $payout = round($amount * $multiplier, 2);
            $this->walletService->creditWin($user, $payout);
        }

        $bet = Bet::create([
            'user_id' => $user->id,
            'game_id' => $game->id,
            'amount' => $amount,
            'choice' => $choice,
            'result' => $gameResult['result'],
            'payout' => $payout,
            'status' => $gameResult['won'] ? 'won' : 'lost',
        ]);

        return response()->json([
            'message' => $gameResult['won'] ? 'You won!' : 'You lost!',
            'bet' => $bet,
            'game_result' => $gameResult,
            'payout' => $payout,
            'balance' => $user->fresh()->wallet->balance,
        ]);
    }

    public function history(Request $request)
    {
        $bets = $request->user()
            ->bets()
            ->with('game:id,name,slug')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($bets);
    }
}
