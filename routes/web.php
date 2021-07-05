<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AppController;
use App\Http\Controllers\ProfileController;


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

Route::view('/test', 'test')->name('test');

Route::get('/', [UserController::class, 'home'])->name('home');

Route::post('/signup', [UserController::class, 'signup'])->name('signup');

Route::post('/login', [UserController::class, 'login'])->name('login');

Route::get('/logout', [UserController::class, 'logout'])->name('logout');

Route::get('/forgot-password', [UserController::class, 'requestPassword'])->middleware('guest')->name('password.request');

Route::post('/forgot-password', [UserController::class, 'recoverPassword'])->middleware('guest')->name('password.email');

Route::get('/reset-password/{token}', [UserController::class, 'sendPasswordLink'])->middleware('guest')->name('password.reset');

Route::post('/reset-password', [UserController::class, 'resetPassword'])->middleware('guest')->name('password.update');

Route::get('/verify-email', [UserController::class, 'verificationNotice'])->middleware('auth')->name('verification.notice');

Route::post('/verification-notification', [UserController::class, 'resendVerificationEmail'])->middleware(['auth', 'throttle:6,1'])->name('verification.send');

Route::get('/email/verify/{id}/{hash}', [UserController::class, 'verifyEmail'])->middleware(['auth', 'signed'])->name('verification.verify');

Route::get('/app', [AppController::class, 'app'])->name('app')->middleware('verified', 'auth');

Route::post('/savecache', [AppController::class, 'saveCache'])->name('saveCache');

Route::get('/loadcache', [AppController::class, 'loadCache'])->name('loadCache');

Route::get('/unsigned', [AppController::class, 'appUnsigned'])->name('appUnsigned');

Route::post('/savesound', [AppController::class, 'saveSound'])->name('saveSound');

Route::post('/saveproject', [AppController::class, 'saveProject'])->name('saveProject');

Route::get('/loadproject/{project}', [AppController::class, 'loadProject'])->name('loadProject');

Route::get('/loadsound/{project}/{recording}', [AppController::class, 'loadSound'])->name('loadSound');

Route::post('/delete', [AppController::class, 'deleteProject'])->name('deleteProject');

Route::get('/profile', [ProfileController::class, 'profileView'])->name('profile')->middleware('verified', 'auth');

Route::post('/profile/change-image', [ProfileController::class, 'changeImage'])->name('changeImage');

Route::post('/profile/update', [ProfileController::class, 'updateProfile'])->name('updateProfile');

