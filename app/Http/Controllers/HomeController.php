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

    public function signup(Request $request)
    {
        $errors = new \Illuminate\Support\MessageBag;

        $email = $request->input('signup_email');
        $user_name = $request->input('signup_username');
        $password = $request->input('signup_password');

        $user = DB::table('users')
            ->where('user_name', $user_name)
            ->where('email', $email)
            ->where('password', $password)
            ->first();

        if ($user) {
            $errors->add('Account already exists', 'The data provided already exists in the database!');
            $redirect = redirect('/')->withErrors($errors);
        } else {
            $user_id = DB::table('users')->insertGetId([
                'user_name' => $user_name,
                'email' => $email,
                'password' => $password,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            session([
                'user_id' => $user_id,
                'user_name' => $user_name
            ]);
            $redirect = redirect('/app');
        }
        return $redirect;
    }

    public function login(Request $request)
    {
        $errors = new \Illuminate\Support\MessageBag;

        $email = $request->input('login_email');
        $password = $request->input('login_password');

        $user = DB::table('users')
            ->where('email', $email)
            ->where('password', $password)
            ->first();

        $user_email = DB::table('users')
            ->where('email', $email)
            ->first();

        $user_password = DB::table('users')
            ->where('password', $password)
            ->first();

        if (!$email || !$password ) {
            $errors->add('Field Email', 'You can not leave any field empty!');
            $redirect = redirect('/')->withErrors($errors);
        } elseif (!$user_email) {
            $errors->add('Field Email', 'Your email is not registered!');
            $redirect = redirect('/')->withErrors($errors);
        } elseif (!$user_password) {
            $errors->add('Wrong Password', 'The password is wrong!');
            $redirect = redirect('/')->withErrors($errors);
        } elseif ($user) {

            $redirect = redirect('/app');
            session([
                'user_id' => $user->id,
                'user_name' => $user->user_name
            ]);
        }
        return $redirect;
    }
}
