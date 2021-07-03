<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Password as PasswordFacade;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

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

        event(new Registered($user));

        return back()->with('status', __('Last step! We have send a confirmation link to your email adress.'));
    }

    public function login(Request $request)
    {

        $credentials = Validator::make($request->all(),[
            'email' => ['required', 'email'],
            'password' => ['required']
        ]);

        if (Auth::attempt($credentials->validate())) {
            $request->session()->regenerate();
            return redirect()->route('app');
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

        return redirect()->route('home');
    }

	public function requestPassword()
	{
		return view('home');
	}

	public function recoverPassword(Request $request)
	{
		$request->validate(['email' => 'required|email']);

    	$status = PasswordFacade::sendResetLink(
        	$request->only('email')
    	);

    	return $status === PasswordFacade::RESET_LINK_SENT
            ? redirect()->route('home')->with(['status' => __($status)])
            : back()->withErrors(['email' => __($status)]);
	}

	public function sendPasswordLink($token)
	{
		return view('resetPassword', ['token' => $token]);
	}

	public function resetPassword(Request $request)
	{
		$request->validate([
	   		'token' => 'required',
	   		'email' => 'required|email',
	   		'password' => 'required|min:8|confirmed',
        ]);

   		$status = PasswordFacade::reset(
	   		$request->only('email', 'password', 'password_confirmation', 'token'),
	   		function ($user, $password) {
			   	$user->forceFill([
			   		'password' => Hash::make($password)
		   		])->setRememberToken(Str::random(60));

		   		$user->save();

		   		event(new PasswordReset($user));
	   		}
   		);

   		return $status === PasswordFacade::PASSWORD_RESET
			? redirect()->route('home')->with('status', __($status))
			: back()->withErrors(['email' => [__($status)]]);
	}

    public function verificationNotice()
    {
        return view('verifyEmail');
    }

    public function resendVerificationEmail(Request $request)
    {
        $request->user()->sendEmailVerificationNotification();

        return back()->with('message', 'Verification link sent!');
    }

    public function verifyEmail(EmailVerificationRequest $request)
    {
        $request->fulfill();

        return redirect()->route('app');
    }
}
