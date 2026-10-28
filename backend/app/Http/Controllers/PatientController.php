<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Patient;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $query = Patient::query();

        if ($request->has('search') && !empty($request->search)) {
            $search = trim($request->search);
            // Matches only names starting with the search query (e.g., "s" matches "Shambel", not "Assefa")
            $query->where('name', 'like', "{$search}%");
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'age' => 'required|integer',
            'gender' => 'required|string',
            'condition' => 'required|string',
            'status' => 'nullable|string',
        ]);

        $patient = Patient::create($validated);
        return response()->json($patient, 201);
    }

    public function update(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);
        $patient->update($request->all());
        return response()->json($patient);
    }

    public function destroy($id)
    {
        Patient::destroy($id);
        return response()->json(['message' => 'Patient deleted successfully']);
    }
}