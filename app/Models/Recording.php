<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recording extends Model
{
	use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'recording_id',
        'file_name',
        'project_id',
    ];

	public function project()
	{
		return $this->belongsTo(Project::class);
	}

}
