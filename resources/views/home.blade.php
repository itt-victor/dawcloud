@extends('layouts.template')
@section('title', 'DawCloud')

@section('content')
<div id="app">

    <div id="user-window">
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
    <button id="play-button" class="play-button"><img width="30px" height="30px" src="storage/icons/play-icon.jpg" alt="play-button"/></button>
    <button id="stop-button" class="stop-button"><img width="30px" height="30px" src="storage/icons/stop-icon.png" alt="stop-button"/></button>
    <button id="record-button" class="record-button"><img width="30px" height="30px" src="storage/icons/record-icon.png" alt="record-button"/></button>

</div>

<section id="mixer" class="mixer">

</section>

<section class="sound-clips">

<div id="tracks" class="tracks"></div>

</section>

@endsection
