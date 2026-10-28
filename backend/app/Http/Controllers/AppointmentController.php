<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;

class AppointmentController extends Controller
{
    public function index()
    {
        return response()->json(Appointment::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required',
            'patientName' => 'required|string',
            'doctor' => 'required|string',
            'date' => 'required|date',
            'time' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        // Replace any existing appointment for this patient or create a new one
        $appointment = Appointment::updateOrCreate(
            ['patient_id' => $validated['patient_id']],
            $validated
        );

        return response()->json($appointment, 201);
    }

    public function destroy($id)
    {
        $appointment = Appointment::findOrFail($id);
        $appointment->delete();

        return response()->json(['message' => 'Appointment deleted successfully']);
    }
}