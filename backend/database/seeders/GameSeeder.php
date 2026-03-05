<?php

namespace Database\Seeders;

use App\Models\Game;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        $games = [
            [
                'name' => 'Coin Flip',
                'slug' => 'coin-flip',
                'type' => 'coin_flip',
                'description' => 'Pick heads or tails. Double your money!',
                'min_bet' => 1,
                'max_bet' => 5000,
                'multiplier' => 2.00,
                'is_active' => true,
            ],
            [
                'name' => 'Dice Roll',
                'slug' => 'dice-roll',
                'type' => 'dice_roll',
                'description' => 'Pick a number from 1 to 6. Guess right and win 6x!',
                'min_bet' => 1,
                'max_bet' => 1000,
                'multiplier' => 6.00,
                'is_active' => true,
            ],
            [
                'name' => 'Slot Machine',
                'slug' => 'slot-machine',
                'type' => 'slot_machine',
                'description' => 'Spin the reels! Match symbols to win big!',
                'min_bet' => 5,
                'max_bet' => 2000,
                'multiplier' => 10.00,
                'is_active' => true,
            ],
        ];

        foreach ($games as $game) {
            Game::updateOrCreate(
                ['slug' => $game['slug']],
                $game
            );
        }
    }
}
