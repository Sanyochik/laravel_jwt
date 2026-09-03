<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'title',
        'description',
        'status',
        'created_at',
    ];

    protected $casts =[
        'created_at'=>'date',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
