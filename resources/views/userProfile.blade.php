@extends('layouts.template')
@section('title', 'DawCloud')

@section('content')

    <div id="profile-container" class="container">
        <div class="row">
            <div class="profile-options col-lg-3">
                <div class="profile-img-container">
                    <img class="profile-img" src="storage/users/avatars/{{ Auth::user()->avatar }}">
                    <label for="input_image" class="change-avatar btn btn-outline-info">Update image</label>
                    <input type="file" id="input_image" accept="image/*" />
                </div>
                <button class="btn btn-outline-info">My projects</button>
                <button class="btn btn-outline-info">Personal Information</button>
                <button class="btn btn-outline-info">Delete account</button>
            </div>
            <div class="col-lg-9 info-container">
                <div class=profile-projects>
                    @foreach ($projects as $project)
                    <a class="projects btn" id="{{ $project }}">{{ $project }}
                        <span class="x-button3">&#10006;</span>
                    </a>
                @endforeach
                </div>
                <div class="personal-info">
                </div>
            </div>
        </div>
    </div>
@endsection

@section('script', 'js/user_profile.js')
