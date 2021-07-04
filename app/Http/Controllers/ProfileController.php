<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Password as PasswordFacade;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;

use App\Models\User;
use App\Models\Project;

class ProfileController extends Controller
{
    public function profileView()
    {
        if (Auth::check()) {
            $projects = Project::where('user_id', Auth::user()->id)
				->pluck('project_name');

            return view('userProfile', ['projects' => $projects]);
        }
        return view('userProfile');
    }

    public function changeImage(Request $request)
    {
        $path = $request->file('image')->store('public/users/avatars');
        $currentuser = User::find(Auth::user()->id);
        $currentuser->avatar = basename($path);
        $currentuser->save();

        return back();
    }

    public function updateProfile(Request $request)
    {
        $currentuser = User::find(Auth::user()->id);
        foreach ($request->input() as $field => $value) {
            if(!empty($value) and $field != '_token') {
                $currentuser->$field = $value;
                $currentuser->save();
            }
        }

        return back();
    }
}
