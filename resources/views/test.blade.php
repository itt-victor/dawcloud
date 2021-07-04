@extends('layouts.template')
@section('title', 'DawCloud')

@section('content')

@if (is_array($test))
    @foreach ($test as $key => $test)
    {{ $key }}: {{ $test }}
    @endforeach
@else
{{ $test }}
@endif

@endsection
