<?php

namespace App\Services;

class DiceRollService
{
    public function play(string $choice): array
    {
        $result = (string) rand(1, 6);
        $won = $choice === $result;

        return [
            'choice' => $choice,
            'result' => $result,
            'won' => $won,
        ];
    }

    public function validateChoice(string $choice): bool
    {
        return in_array($choice, ['1', '2', '3', '4', '5', '6']);
    }
}
