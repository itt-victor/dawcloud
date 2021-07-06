<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

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
        $request->validate(['image' => 'image']);
        $path = $request->file('image')->store('public/users/avatars');
        $currentuser = User::find(Auth::user()->id);
        $currentuser->avatar = basename($path);
        $currentuser->save();

        return back();
    }

    public function updateProfile(Request $request)
    {
        $currentuser = User::find(Auth::user()->id);
        $validation = $request->validate([
            'user_name' => 'nullable|max:255',
            'name' => 'nullable|max:255',
            'surname' => 'nullable|max:255',
            'city' => 'nullable|max:255',
            'country' => 'nullable|max:255',
        ]);
        $filtered_data = array_filter($validation);

        foreach ($filtered_data as $field => $value)
            $currentuser->$field = $value;

        $currentuser->save();

        return back()->with('status', 'Personal information updated successfully!');
    }

    public function updateUser(Request $request)
    {
        $currentuser = User::find(Auth::user()->id);
        $validation = $request->validate([
            'email' => 'unique:users|email',
            'password' => 'min:8',
        ]);

        if (array_key_exists('password', $validation))
            $currentuser->password = Hash::make($validation['password']);
        else
            $currentuser->email = $validation['email'];

        $currentuser->save();

        return back()->with('status', 'Your credentials have been updated!');
    }

    public function deleteAccount()
    {
        $currentuser = User::find(Auth::user()->id);
        $projects = Project::where('user_id', $currentuser->id)->get();
        foreach ($projects as $project) $project->delete();
        $currentuser->delete();

        return redirect()->route('home');
    }
}
