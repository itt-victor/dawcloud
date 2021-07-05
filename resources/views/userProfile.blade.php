@extends('layouts.template')
@section('title', 'DawCloud')

@section('content')

    <div id="profile-container" class="container">
        <a href="app" class="back-to-app">back <span class="back-arrow">&#x21A9;</span></a>
        <div class="row">
            <div class="profile-options col-lg-3">
                <div class="profile-img-container">
                    <img class="profile-img" src="storage/users/avatars/{{ Auth::user()->avatar }}">
                    <form method="POST" action="profile/change-image" enctype="multipart/form-data">
                        @csrf
                        <label for="input_image" class="change-avatar btn btn-outline-info">Update image</label>
                        <input type="file" id="input_image" accept="image/*" name="image" onchange="form.submit()"/>
                    </form>
                </div>
                <button class="btn btn-outline-info personal-info">Personal Information</button>
                <button class="btn btn-outline-info my-projects">My projects</button>
                <button class="btn btn-outline-info configuration">Configuration</button>
            </div>
            <div class="col-lg-9 info-container">
                <div class=profile-projects>
                    @foreach ($projects as $project)
                        <a class="projects btn" id="{{ $project }}">{{ $project }}
                            <span class="x-button3">&#10006;</span></a>
                    @endforeach
                </div>
                <div class="personal-info-container">
                    <form method="POST" action="profile/update">
                        @csrf
                        <label for="user_name">User name: </label>
                        <input type="text" id="user_name" name='user_name' placeholder="{{ Auth::user()->user_name }}">
                        <label for="name">Name: </label>
                        <input type="text" id="name" name='name' placeholder="{{ Auth::user()->name }}">
                        <label for="surname">Surname: </label>
                        <input type="text" id="surname" name="surname" placeholder="{{ Auth::user()->surname }}">
                        <label for="city">City: </label>
                        <input type="text" id="city" name="city" placeholder="{{ Auth::user()->city }}">
                        <label for="country">Country: </label>
                        <input type="text" id="country" name="country" placeholder="{{ Auth::user()->country }}">
                        <button type="submit">Update your profile</button>
                </div>
                <div class="configuration-container">
                    <label for="email">Email address: </label>
                    <input type="email" id="email" name="email" placeholder="{{ Auth::user()->email }}">
                    <label for="password">Password: </label>
                    <input type="password" id="password" name="password">
                    <button class="btn btn-outline-info dlt-account">Delete account</button>
                </div>
            </div>
        </div>
        @if ($errors->any())
        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
        @endif
    </div>
@endsection

@section('script', 'js/user_profile.js')
