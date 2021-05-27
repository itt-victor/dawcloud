<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\MessageBag;

class HomeController extends Controller
{
    public function home()
    {
        return view('home');
    }

    public function signup(Request $request){

        $errors = new \Illuminate\Support\MessageBag;
		$email = $request->input('signup_email');
        $user_name = $request->input('signup_username');
        $password = $request->input('signup_password');

		$user = DB::table('users')
		    ->where('user_name', $user_name)
			->where('email', $email)
			->where('password', $password)
			->first();

		if ($user !== null) {
			$errors->add('Account already exists', 'The data provided already exists in the database!');
			$redirect = view('home')->withErrors($errors);
		} else {
			$user_id = DB::table('users')->insertGetId([
				'user_name' => $user_name,
				'email' => $email,
				'password' => Hash::make($password),
				'created_at' => now(),
				'updated_at' => now()
			]);

			$redirect = redirect('/app?user='.$user_name);

		}
		return $redirect;
    }

    public function login(Request $request){

		$errors = new \Illuminate\Support\MessageBag;

		$email = $request->input('login_email');
		$password = $request->input('login_password');

		$user = DB::table('users')
			->where('email', $email)
			->where('password', $password)
			->first();

	    if ($search){
			$redirect = redirect('/app?user='.$user->user_name);
		} else {
			$errors->add('Field Email', 'You can not leave any field empty!');
			$redirect = view('home')->withErrors($errors);
		}
		return $redirect;
    }

}
