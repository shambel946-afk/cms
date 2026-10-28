<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Doctor;

class DoctorController extends Controller
{
    // Fetch all doctors permanently from the database
    public function index()
    {
        return Doctor::all();
    }

    public function store(Request $request) 
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'specialization' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'status' => 'required|string',
        ]);

        $doctor = Doctor::create($validated);
        return response()->json($doctor, 201);
    }
}