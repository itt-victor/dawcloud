<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;


class HomeController extends Controller
{
    public function home()
    {

        return view('home');
    }

    public function signup(Request $request){

        echo 'llorooo';
    }

    public function login(Request $request){

    }

}
