<?php

namespace App\Http\Controllers;

use App\Services\WalletService;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    protected WalletService $walletService;

    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }

    public function balance(Request $request)
    {
        return response()->json([
            'balance' => $this->walletService->getBalance($request->user()),
        ]);
    }

    public function deposit(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1|max:100000',
        ]);

        try {
            $transaction = $this->walletService->deposit(
                $request->user(),
                $request->amount
            );

            return response()->json([
                'message' => 'Deposit successful',
                'transaction' => $transaction,
                'balance' => $request->user()->fresh()->wallet->balance,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function withdraw(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1|max:100000',
        ]);

        try {
            $transaction = $this->walletService->withdraw(
                $request->user(),
                $request->amount
            );

            return response()->json([
                'message' => 'Withdrawal successful',
                'transaction' => $transaction,
                'balance' => $request->user()->fresh()->wallet->balance,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
