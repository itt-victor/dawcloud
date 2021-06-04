@extends('layouts.template')
@section('title', 'DawCloud')

@section('content')

<div class="loading"><p>Loading</p></div>
    <div id="app">
        <div class="top-row">

            <div id="buttonpad" class="buttonpad">
                <div class="master_controls">
                    <button id="play-button" class="play-button btn btn-outline-info"><img width="30px" height="30px"
                            src="storage/icons/play-icon.jpg"  /></button>
                    <button id="stop-button" class="stop-button btn btn-outline-info"><img width="30px" height="30px"
                            src="storage/icons/stop-icon.png" /></button>
                    <button id="record-button" class="record-button btn btn-outline-info"><img width="30px" height="30px"
                            src="storage/icons/record-icon.png"  /></button>
                    <button id=metric_button class="btn btn-outline-info btn-metric"></button>
                    <button id="bpm_button" class="btn btn-outline-info btn-bpm"></button>
                </div>
            </div>

            <h1 id="page-title" class="h1 center"><a class="a_title" href="{{route('home')}}">daw Cloud</a></h1>

		    @if (!$signed)
            <div id="user_options">
			    <p id="signup_now">Sign up, you will be able to save your projects</p>
			    <form id="signup_reminder" method="POST" action="{{ route('signup') }}">
                    <p class="signup_reminder_text">Create account. It's free <span class="x-button">&#10006;</span></p>
                    @csrf
                    <label for="signup_email">Email</label>
                    <input type="email" class="" name="email" autocomplete="off">
                    <label for="signup_username">User Name</label>
                    <input type="text" class="" name="user_name" autocomplete="off">
                    <label for="signup_password">Password</label>
                    <input type="password" class="" name="password" autocomplete="off">
                    <button id="register2" type="submit">Sign Up!</button>
                </form>
		    </div>
		    @else
		    <div id="user_options">
			    <button id="user_welcome" type="button" class= "btn dropdown-toggle"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Hello {{ Auth::user()->user_name }}</button>
		    	<div class="dropdown-menu" aria-labelledby="user_welcome">
                    <label id="load_sound" for="load_sound_hidden" class="btn btn-outline-info dropdown-item">Load sound</label>
		    		<input type="file" id="load_sound_hidden" class="btn btn-outline-info dropdown-item" accept="audio/wav, audio/mp3"/>
                    <button id="load_project" class="btn btn-outline-info dropdown-item">My projects</button>
                    <button id="save_project" class="btn btn-outline-info dropdown-item">Save project</button>
		    		<button id="log_out" class="btn btn-outline-info dropdown-item"><a href="{{route('logout')}}">Log out</a></button>
		    	</div>
		    	<div id="load_dialogue">
                    @if (!empty($projects[0]))
                        <p class="dummy-space2"><span class="x-button2" id="projects-close" >&#10006;</span></p>
			    	    @foreach ( $projects as $project)
                            <a class="projects btn" id="{{$project}}">{{$project }}
                                <span class="x-button3" >&#10006;</span>
                            </a>
                        @endforeach
                        <div class="delete_confirmation">
                            <p>Are you sure you want to delete this project?</p>
                            <button id="delete_confirm">Ok</button><button id="delete_cancel">Cancel</button>
                        </div>
                    @else
                        <p>No projects yet!! <span class="x-button2" id="projects-close" >&#10006;</span></p>
                    @endif
		    	</div>
		    	<div id="save_dialogue">
		    		<p class="padding-to-text">Enter the name of your new or existing project:</p>
                        <span class="x-button4" id="save-close">&#10006;</span>
		    		<input id="project_name" type="text">
	    		</div>
	    	</div>
            @endif

            <div class="zoom-btn">
                <button id="zoomin" type="button" class="btn btn-outline-info">+</button>
                <button id="zoomout" type="button" class="btn btn-outline-info">-</button>
            </div>

        </div>

        <div id="toolbox">
            <button id="normal_function" class="btn btn-outline-info"><img width="20px" height="20px"
                src="storage/icons/normal_cursor.png"  /></button>
            <button id="cut_function" class="btn btn-outline-info"><img width="20px" height="20px"
                src="storage/icons/cut_icon.svg"  /></button>
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

            @include('layouts.panner', ['number'=> '0'])
            @include('layouts.panner', ['number'=> '1'])
            @include('layouts.panner', ['number'=> '2'])
            @include('layouts.panner', ['number'=> '3'])
            @include('layouts.panner', ['number'=> '4'])
            @include('layouts.panner', ['number'=> '5'])
            @include('layouts.panner', ['number'=> '6'])
            @include('layouts.panner', ['number'=> '7'])

        </section>

        <section class="sound-clips">

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

@section('script', 'js/app_core.js' )
