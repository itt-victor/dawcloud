<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
	use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'project_name',
        'json_data',
        'user_id',
    ];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

    public function recordings()
    {
        return $this->hasMany(Recording::class);
    }

}
