@extends('layouts.template')
@section('title', 'DawCloud')

@section('content')
    <div id="app">

        <div id="user-window" style="display: none; visibility: hidden;">
            <form id="user login">
                @csrf
                <input type="email" placeholder="Type your user e-mail">
                <input type="text" placeholder="Password">
                <button type="submit">Log In!</button>
            </form>
            <button id="register">Sign In!</button>
        </div>
        <h1 id="page-title" class="h1 center">daw Cloud</h1>


        <div id="buttonpad" class="buttonpad">
            <div>
                <button id="add-track" class="add-track btn btn-outline-info">Add Track</button>
                <button id="remove-track" class="remove-track btn btn-outline-info">Remove Track</button>
                <button id="load_sound" class="btn btn-outline-info">Load sound</button>
            </div>
            <div class= "buttonpad">
                <button id="play-button" class="play-button btn btn-outline-info"><img width="30px" height="30px"
                        src="storage/icons/play-icon.jpg" alt="play-button" /></button>
                <button id="stop-button" class="stop-button btn btn-outline-info"><img width="30px" height="30px"
                        src="storage/icons/stop-icon.png" alt="stop-button" /></button>
                <button id="record-button" class="record-button btn btn-outline-info"><img width="30px" height="30px"
                        src="storage/icons/record-icon.png" alt="record-button" /></button>
            </div>
        </div>

        <section id="mixer" class="mixer">
            <div class="fader" id="master_fader">
            </div>
            @include('layouts.fader', ['number'=> '0'])
            @include('layouts.fader', ['number'=> '1'])
            @include('layouts.fader', ['number'=> '2'])
            @include('layouts.fader', ['number'=> '3'])
            @include('layouts.fader', ['number'=> '4'])
            @include('layouts.fader', ['number'=> '5'])
            @include('layouts.fader', ['number'=> '6'])
            @include('layouts.fader', ['number'=> '7'])
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
            <canvas id="cursor"></canvas>
            <div id="time-layout" style="background-color: grey;"><canvas id="layout"></canvas></div>
            <div id="tracks" class="tracks">
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
