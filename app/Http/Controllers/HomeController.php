<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function __invoke()
    {
        $variables =
        ["textito" => "Pon un numerito, porfavorcito: ",
        'resu' => '',
        'clase1' => '',
        ];
        return view('home', $variables);
    }


}
