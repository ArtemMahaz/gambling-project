<?php

namespace App\Services;

class SlotMachineService
{
    private array $symbols = ['cherry', 'lemon', 'orange', 'plum', 'bell', 'bar', 'seven'];

    public function play(string $choice): array
    {
        $reel1 = $this->symbols[array_rand($this->symbols)];
        $reel2 = $this->symbols[array_rand($this->symbols)];
        $reel3 = $this->symbols[array_rand($this->symbols)];

        $result = "$reel1|$reel2|$reel3";

        if ($reel1 === $reel2 && $reel2 === $reel3) {
            $won = true;
            $multiplierBonus = $reel1 === 'seven' ? 3.0 : 1.0;
        }
        elseif ($reel1 === $reel2 || $reel2 === $reel3 || $reel1 === $reel3) {
            $won = true;
            $multiplierBonus = 0.5;
        }
        else {
            $won = false;
            $multiplierBonus = 0;
        }

        return [
            'choice' => $choice,
            'result' => $result,
            'reels' => [$reel1, $reel2, $reel3],
            'won' => $won,
            'multiplier_bonus' => $multiplierBonus,
        ];
    }

    public function validateChoice(string $choice): bool
    {
        return $choice === 'spin';
    }
}
