<?php
use App\Models\User;
use Illuminate\Http\Request;

Route::post('/login', function (Request $request) {
    $user = User::first() ?? User::create([
        'name' => 'shambel',
        'email' => 'shambel@gmail.com',
        'password' => bcrypt('pass')
    ]);

    return response()->json([
        'message' => 'Login successful',
        'token' => $user->createToken('admin-token')->plainTextToken,
        'user' => $user
    ]);
});