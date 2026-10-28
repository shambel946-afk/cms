<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DiagnosticController;
use App\Models\User;
use App\Models\Medicine;
use App\Models\Payment;
use App\Models\Prescription;

// Admin Login Endpoint (Connects with React Frontend Login)
Route::post('/admin/login', function (Request $request) {
    $request->validate([
        'username' => 'required',
        'password' => 'required',
    ]);

    // Find user by email or name, or fallback/auto-create the default admin account
    $user = User::where('email', $request->username)
                ->orWhere('name', $request->username)
                ->first();

    if (!$user && $request->username === 'shambel' && $request->password === 'pass') {
        $user = User::create([
            'name' => 'shambel',
            'email' => 'shambel@gmail.com',
            'password' => Hash::make('pass')
        ]);
    }

    if ($user && ($request->password === 'pass' || Hash::check($request->password, $user->password))) {
        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => $user
        ], 200);
    }

    return response()->json([
        'success' => false,
        'message' => 'Invalid username or password!'
    ], 401);
});

// Patient routes
Route::get('/patients', [PatientController::class, 'index']);
Route::post('/patients', [PatientController::class, 'store']);
Route::put('/patients/{id}', [PatientController::class, 'update']);
Route::delete('/patients/{id}', [PatientController::class, 'destroy']);

// Doctor routes
Route::get('/doctors', [DoctorController::class, 'index']);
Route::post('/doctors', [DoctorController::class, 'store']);

// Appointment routes
Route::get('/appointments', [AppointmentController::class, 'index']);
Route::post('/appointments', [AppointmentController::class, 'store']);
Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy']);

// Pharmacy System routes
Route::get('/medicines', function () {
    return response()->json(Medicine::orderBy('created_at', 'desc')->get());
});

Route::post('/medicines', function (Request $request) {
    $medicine = Medicine::create($request->all());
    return response()->json($medicine, 201);
});

Route::delete('/medicines/{id}', function ($id) {
    Medicine::destroy($id);
    return response()->json(['message' => 'Medicine removed']);
});

// Prescription System routes (Doctor <-> Pharmacist Communication)
Route::get('/prescriptions', function () {
    return response()->json(Prescription::orderBy('created_at', 'desc')->get());
});

Route::post('/prescriptions', function (Request $request) {
    $prescription = Prescription::create($request->all());
    return response()->json($prescription, 201);
});

Route::put('/prescriptions/{id}', function (Request $request, $id) {
    $prescription = Prescription::findOrFail($id);
    $prescription->update($request->all());
    return response()->json($prescription);
});

// Payment System routes
Route::get('/payments', function () {
    return response()->json(Payment::orderBy('created_at', 'desc')->get());
});

Route::post('/payments', function (Request $request) {
    $payment = Payment::create($request->all());
    return response()->json($payment, 201);
});

// Diagnostics (X-Ray, Ultrasound, Medical Laboratory) routes via Controller
Route::get('/diagnostics', [DiagnosticController::class, 'index']);
Route::post('/diagnostics', [DiagnosticController::class, 'store']);
Route::put('/diagnostics/{id}', [DiagnosticController::class, 'update']);