<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AccountController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\CommentController;




Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AccountController::class, 'register']);
Route::post('/login', [AccountController::class, 'login']);

//Public Content
Route::controller(ContentController::class)->group(
    function () {
        Route::get('/contents', 'index');
        Route::get('/people', 'users');
        Route::get('/tags', 'getTags');
    }
);


Route::middleware('auth:sanctum')->group(function () {

    //  AccountController Routes
    Route::controller(AccountController::class)->group(function () {
        Route::post('/logout', 'logout');
        Route::get('/me/posts', 'myPosts');
        Route::post('/profile/update', 'updateProfile');
        Route::get('/me/posts/summary', 'myPostsSummary');
    });

    //  ContentController Routes
    Route::prefix('content')->controller(ContentController::class)->group(function () {
        Route::get('/search', 'globalSearch');

        Route::get('/{slug}', 'show');          //get list of content with params of type

        Route::post('/', 'store');              //store content with params of type
        Route::patch('/{slug}', 'update');      //update content with params of type
        Route::delete('/{slug}', 'destroy');    //delete content with params of type
    });

    //  CommentController Routes
    Route::controller(CommentController::class)->group(function () {
        Route::post('/posts/{post}/comments', 'store');
    });
});
