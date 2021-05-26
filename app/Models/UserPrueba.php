<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;


class User extends Model
{
    use HasFactory;


    public function store(Request $request)
    {
        // Validate the request...

        $user = new User;

        $user->user_name = $request->user_name;
        $user->email = $request->email;
        $user->password = $request->password;

        $user->save();
    }


}
