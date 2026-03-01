<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'type',
        'description',
        'min_bet',
        'max_bet',
        'multiplier',
        'is_active',
    ];

    public function bets()
    {
        return $this->hasMany(Bet::class);
    }
}
