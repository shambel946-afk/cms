<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller {
    public function index() {
        return response()->json(Patient::all());
    }

    public function store(Request $request) {
        $patient = Patient::create($request->all());
        return response()->json($patient, 201);
    }

    public function show(Patient $patient) {
        return response()->json($patient);
    }

    public function update(Request $request, Patient $patient) {
        $patient->update($request->all());
        return response()->json($patient);
    }

    public function destroy(Patient $patient) {
        $patient->delete();
        return response()->json(null, 204);
    }
}