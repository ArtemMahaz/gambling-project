<?php

namespace App\Services;

use App\Models\Game;

class GameService
{
    public function resolve(Game $game): CoinFlipService|DiceRollService|SlotMachineService
    {
        return match ($game->type) {
            'coin_flip' => new CoinFlipService(),
            'dice_roll' => new DiceRollService(),
            'slot_machine' => new SlotMachineService(),
            default => throw new \Exception('Unknown game type'),
        };
    }
}
