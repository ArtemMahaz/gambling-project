<?php

namespace App\Services;

use App\Models\User;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class WalletService
{
    public function getBalance(User $user): string
    {
        return $user->wallet->balance;
    }

    public function deposit(User $user, float $amount, string $description = 'Deposit'): Transaction
    {
        return DB::transaction(function () use ($user, $amount, $description) {
            $wallet = $user->wallet;
            $wallet->balance += $amount;
            $wallet->save();

            return Transaction::create([
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'type' => 'deposit',
                'amount' => $amount,
                'balance_after' => $wallet->balance,
                'description' => $description,
            ]);
        });
    }

    public function withdraw(User $user, float $amount, string $description = 'Withdrawal'): Transaction
    {
        return DB::transaction(function () use ($user, $amount, $description) {
            $wallet = $user->wallet;

            if ($wallet->balance < $amount) {
                throw new \Exception('Insufficient balance');
            }

            $wallet->balance -= $amount;
            $wallet->save();

            return Transaction::create([
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'type' => 'withdrawal',
                'amount' => $amount,
                'balance_after' => $wallet->balance,
                'description' => $description,
            ]);
        });
    }

    public function placeBet(User $user, float $amount): Transaction
    {
        return $this->withdraw($user, $amount, 'Bet placed');
    }

    public function creditWin(User $user, float $amount): Transaction
    {
        return $this->deposit($user, $amount, 'Bet won');
    }
}
