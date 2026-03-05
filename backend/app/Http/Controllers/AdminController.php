<?php

namespace App\Http\Controllers;

use App\Models\Bet;
use App\Models\Game;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        $totalUsers = User::where('role', 'user')->count();
        $totalBets = Bet::count();
        $totalWagered = Bet::sum('amount');
        $totalPayouts = Bet::sum('payout');
        $houseProfit = $totalWagered - $totalPayouts;
        $totalDeposits = Transaction::where('type', 'deposit')->sum('amount');
        $totalWithdrawals = Transaction::where('type', 'withdrawal')->sum('amount');

        $recentBets = Bet::with(['user:id,name,email', 'game:id,name'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'stats' => [
                'total_users' => $totalUsers,
                'total_bets' => $totalBets,
                'total_wagered' => $totalWagered,
                'total_payouts' => $totalPayouts,
                'house_profit' => $houseProfit,
                'total_deposits' => $totalDeposits,
                'total_withdrawals' => $totalWithdrawals,
            ],
            'recent_bets' => $recentBets,
        ]);
    }

    public function users()
    {
        $users = User::with('wallet')
            ->withCount('bets')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($users);
    }

    public function showUser(int $id)
    {
        $user = User::with(['wallet', 'bets' => function ($query) {
            $query->with('game:id,name')->orderBy('created_at', 'desc')->limit(20);
        }])->withCount('bets')->findOrFail($id);

        return response()->json(['user' => $user]);
    }

    public function banUser(int $id)
    {
        $user = User::findOrFail($id);

        if ($user->role === 'admin') {
            return response()->json([
                'message' => 'Cannot ban an admin',
            ], 403);
        }

        $user->is_banned = !$user->is_banned;
        $user->save();

        $status = $user->is_banned ? 'banned' : 'unbanned';

        return response()->json([
            'message' => "User has been $status",
            'user' => $user,
        ]);
    }

    public function toggleGame(int $id)
    {
        $game = Game::findOrFail($id);
        $game->is_active = !$game->is_active;
        $game->save();

        $status = $game->is_active ? 'activated' : 'deactivated';

        return response()->json([
            'message' => "Game has been $status",
            'game' => $game,
        ]);
    }
}
