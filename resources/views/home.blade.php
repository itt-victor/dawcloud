@extends('layouts.template')
@section('title', 'DawCloud')

@section('content')

        <h1 id="page-title" class="h1 center">daw Cloud</h1>
        <div id="user-window">
            <form id="user_signup" method="POST" action="{{ route('signup') }}">
                <b>Create account. It's free</b>
                @csrf
                <label for="signup_email">Email</label>
                <input type="email" id="signup_email" name="email" autocomplete="off">
                <label for="signup_username">User Name</label>
                <input type="text" id="signup_username" name="user_name" autocomplete="off">
                <label for="signup_password">Password</label>
                <input type="password" id="signup_password" name="password" autocomplete="off">
                <button id="register" type="submit">Sign Up!</button>
            </form>
            <form id="user_login" method="POST" action="{{ route('login') }}">
                <b>Log in to daw Cloud</b>
                @csrf
                <label for="login_email">Email</label>
                <input type="email" id="login_email" name="email" autocomplete="off">
                <label for="login_password">Password</label>
                <input type="password" id="login_password" name="password" autocomplete="off">
                <button id="login" type="submit">Log In!</button>
            </form>

        </div>
        <a href="{{ route('appUnsigned') }}"
            id="startunsigned" name="startunsigned" class="startunsigned">Start daw Cloud without account</a>

		@if ($errors->any())
        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
        @endif

@endsection

@section('script', 'js/home.js' )
