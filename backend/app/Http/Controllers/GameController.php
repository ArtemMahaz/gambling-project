<?php

namespace App\Http\Controllers;

use App\Models\Game;

class GameController extends Controller
{
    public function index()
    {
        $games = Game::where('is_active', true)->get();

        return response()->json([
            'games' => $games,
        ]);
    }

    public function show(string $slug)
    {
        $game = Game::where('slug', $slug)->firstOrFail();

        return response()->json([
            'game' => $game,
        ]);
    }
}
