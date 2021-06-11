<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
use \Illuminate\Foundation\Auth\User as Auth;

class User extends Auth
{
	protected $guarded = [];

    public function projects()
	{
		return $this->hasMany(Project::class);
	}

    use HasFactory;
}
