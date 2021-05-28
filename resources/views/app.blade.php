@extends('layouts.template')
@section('title', 'DawCloud')

@section('content')
<div class="loading"><p>Loading</p></div>
    <div id="app">
        <h1 id="page-title" class="h1 center"><a class="a_title" href="{{route('home')}}">daw Cloud</a></h1>

		@if (Request::get('user') == 'unsigned')
        <div>
			<p id="signup_now">Sign up, you will be able to save your projects</p>
			<form id="signup_reminder" method="POST" action="{{ route('signup') }}">
                <p class="signup_reminder_text">Create account. It's free <span class="x-button">&#10006;</span></p>
                @csrf
                <label for="signup_email">Email</label>
                <input type="email" class="" name="signup_email" autocomplete="off">
                <label for="signup_username">User Name</label>
                <input type="text" class="" name="signup_username" autocomplete="off">
                <label for="signup_password">Password</label>
                <input type="password" class="" name="signup_password" autocomplete="off">
                <button id="register2" type="submit">Sign Up!</button>
            </form>
		</div>
		@else
		<div id="user_options">
			<button id="user_welcome" type="button" class= "btn dropdown-toggle"
            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Hello {{ session('user_name') }} </button>
			<div class="dropdown-menu" aria-labelledby="user_welcome">
                <button id="load_project" class="btn btn-outline-info dropdown-item">My projects</button>
                <button id="save_project" class="btn btn-outline-info dropdown-item">Save new project</button>
				<label id="load_sound" for="load_sound_hidden" class="btn btn-outline-info dropdown-item">Load sound</label>
				<input type="file" id="load_sound_hidden" class="btn btn-outline-info dropdown-item" accept="audio/wav, audio/mp3"></input>
			</div>
			<div id="load_dialogue">
                @if (!empty($projects[0]))
				    @foreach ( $projects as $project)
                        <a class="projects btn" id="{{$project}}">{{$project }}</a>
                    @endforeach
                @else
                    <p>No projects yet!!</p>
                @endif
			</div>
			<div id="save_dialogue">
				<p>Enter a name for your new project:</p>
				<input id="project_name" type="text">
			</div>
		</div>
        @endif

        <div id="buttonpad" class="buttonpad">
            <div class="master_controls">
                <button id="play-button" class="play-button btn btn-outline-info"><img width="30px" height="30px"
                        src="storage/icons/play-icon.jpg"  /></button><!--alt="play-button"-->
                <button id="stop-button" class="stop-button btn btn-outline-info"><img width="30px" height="30px"
                        src="storage/icons/stop-icon.png" /></button><!-- alt="stop-button"-->
                <button id="record-button" class="record-button btn btn-outline-info"><img width="30px" height="30px"
                        src="storage/icons/record-icon.png"  /></button><!-- alt="record-button"-->
                <button id=metric_button class="btn btn-outline-info btn-metric"></button>
                <button id="bpm_button" class="btn btn-outline-info btn-bpm"></button>
            </div>
        </div>

        <section id="mixer" class="mixer">
            @include('layouts.fader', ['number'=> '0', 'number2'=>'1'])
            @include('layouts.fader', ['number'=> '1', 'number2'=>'2'])
            @include('layouts.fader', ['number'=> '2', 'number2'=>'3'])
            @include('layouts.fader', ['number'=> '3', 'number2'=>'4'])
            @include('layouts.fader', ['number'=> '4', 'number2'=>'5'])
            @include('layouts.fader', ['number'=> '5', 'number2'=>'6'])
            @include('layouts.fader', ['number'=> '6', 'number2'=>'7'])
            @include('layouts.fader', ['number'=> '7', 'number2'=>'8'])
            <div class="fader" id="master_fader"><a class="fader-knob" data-y="20"></a><div class="trcknr mxrmstr">Master</div></div>
        </section>

        <section class="sound-clips">
			<div class="zoom-btn">
                <button id="zoomin" type="button" class="btn btn-outline-info">+</button>
                <button id="zoomout" type="button" class="btn btn-outline-info">-</button>
            </div>

            <div class="track_names">
                <div class="dummy-block"></div>
                @include('layouts.track_name', ['number'=> '1', 'number2'=> '0'])
                @include('layouts.track_name', ['number'=> '2', 'number2'=> '1'])
                @include('layouts.track_name', ['number'=> '3', 'number2'=> '2'])
                @include('layouts.track_name', ['number'=> '4', 'number2'=> '3'])
                @include('layouts.track_name', ['number'=> '5', 'number2'=> '4'])
                @include('layouts.track_name', ['number'=> '6', 'number2'=> '5'])
                @include('layouts.track_name', ['number'=> '7', 'number2'=> '6'])
                @include('layouts.track_name', ['number'=> '8', 'number2'=> '7'])
            </div>

            <div id="tracks" class="tracks">
                <div id="time-layout" style="background-color: grey;"><canvas id="layout"></canvas></div>
                <canvas id="cursor"></canvas>
                @include('layouts.track_canvas', ['number'=>'0'])
                @include('layouts.track_canvas', ['number'=>'1'])
                @include('layouts.track_canvas', ['number'=>'2'])
                @include('layouts.track_canvas', ['number'=>'3'])
                @include('layouts.track_canvas', ['number'=>'4'])
                @include('layouts.track_canvas', ['number'=>'5'])
                @include('layouts.track_canvas', ['number'=>'6'])
                @include('layouts.track_canvas', ['number'=>'7'])
            </div>
        </section>
    </div>

@endsection
