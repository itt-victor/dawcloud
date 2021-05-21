@extends('layouts.template')
@section('title', 'DawCloud')

@section('content')
<div class="loading"></div>
    <div id="app">
        <h1 id="page-title" class="h1 center">daw Cloud</h1>

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
            <button id="load_sound" class="btn btn-outline-info">Load sound</button>
            <div class="zoom-btn">
                <button id="zoomin" type="button" class="btn btn-outline-info">+</button>
                <button id="zoomout" type="button" class="btn btn-outline-info">-</button>
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

            <!--<div id="time-layout" style="background-color: grey;"><canvas id="layout"></canvas></div>-->
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
        <div class="modal-loading" id="modal-loading"></div>
    </div>

@endsection
