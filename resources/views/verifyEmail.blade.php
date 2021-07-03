@extends('layouts.template')
@section('title', 'DawCloud')

@section('content')

        <h1 id="page-title" class="h1 center home-title"><a class="a_title" href="{{ route('home') }}">daw Cloud</a></h1>

            <div class="verify_email_dialogue">
				<p class="verify_email_text">An email was sent to you to verify your new account. </p>
                <form method="POST" action="{{ route('verification.send')}}">
                    @csrf
                    <button type="submit" class="verify_email_text">If you did not receive the email, please click to this link</button>
                </form>
			</div>
        </div>
        <a href="{{ route('appUnsigned') }}"
            id="startunsigned" name="startunsigned" class="startunsigned">Start daw Cloud without account</a>

		@if(session('message'))
		<div class="alert alert-success">
			<ul>
                <li>{{ session('message') }}</li>
            </ul>
		</div>
		@endif

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
