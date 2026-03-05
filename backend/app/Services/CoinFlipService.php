<?php

namespace App\Services;

class CoinFlipService
{
    public function play(string $choice): array
    {
        $options = ['heads', 'tails'];
        $result = $options[array_rand($options)];
        $won = $choice === $result;

        return [
            'choice' => $choice,
            'result' => $result,
            'won' => $won,
        ];
    }

    public function validateChoice(string $choice): bool
    {
        return in_array($choice, ['heads', 'tails']);
    }
}
