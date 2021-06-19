<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;

use App\Models\User;

class UserController extends Controller
{
    public function home()
    {
        return view('home');
    }

    public function signup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'unique:users', 'max:255'],
            'user_name' => ['required', 'max:255'],
            'password' => ['required', Password::min(8)]
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        $email = $request->input('email');
        $user_name = $request->input('user_name');
        $password = $request->input('password');

		$user = User::create([
			'user_name' => $user_name,
            'email' => $email,
            'password' => Hash::make($password)
		]);

        Auth::loginUsingId($user->id);

        return redirect('app');
    }

    public function login(Request $request)
    {

        $credentials = Validator::make($request->all(),[
            'email' => ['required', 'email'],
            'password' => ['required']
        ]);

        if (Auth::attempt($credentials->validate())) {
            $request->session()->regenerate();
            return redirect('app');
        }

        return back()->withErrors([
            'email' => 'The provided info is not valid...',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
