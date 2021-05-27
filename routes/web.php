<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AppController;
use Illuminate\Http\Request;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//Route::get('/', [HomeController::class, 'signup'])->name('prueba');  //con este puesto tienes una ventana al server <3 - para probar solo

Route::get('/', [HomeController::class, 'home'])->name('home');

Route::post('/signup', [HomeController::class, 'signup'])->name('signup');

Route::post('/login', [HomeController::class, 'login'])->name('login');

Route::get('/app', [AppController::class, 'app'])->name('app');

Route::post('/savesound', [AppController::class, 'saveSound'])->name('saveSound');

Route::post('/saveproject', [AppController::class, 'saveProject'])->name('saveProject');

Route::get('/loadproject/{project}', [AppController::class, 'loadProject'])->name('loadProject');

Route::get('/loadsound/{project}/{recording}', [AppController::class, 'loadSound'])->name('loadSound');

//Auth::routes();

//Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');   HAY QUE MIRAR LO DE ARTISAN AUTH
