<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AppController;


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

Route::get('/', [UserController::class, 'home'])->name('home');

Route::post('/signup', [UserController::class, 'signup'])->name('signup');

Route::post('/login', [UserController::class, 'login'])->name('login');

Route::get('/logout', [UserController::class, 'logout'])->name('logout');

Route::get('/app', [AppController::class, 'app'])->name('app');

Route::post('/savecache', [AppController::class, 'saveCache'])->name('saveCache');

Route::get('/loadcache', [AppController::class, 'loadCache'])->name('loadCache');

Route::get('/unsigned', [AppController::class, 'appUnsigned'])->name('appUnsigned');

Route::post('/savesound', [AppController::class, 'saveSound'])->name('saveSound');

Route::post('/saveproject', [AppController::class, 'saveProject'])->name('saveProject');

Route::get('/loadproject/{project}', [AppController::class, 'loadProject'])->name('loadProject');

Route::get('/loadsound/{project}/{recording}', [AppController::class, 'loadSound'])->name('loadSound');

Route::post('/delete', [AppController::class, 'deleteProject'])->name('deleteProject');

