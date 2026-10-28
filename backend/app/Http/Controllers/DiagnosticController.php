<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DiagnosticRequest;

class DiagnosticController extends Controller
{
    public function index(Request $request)
    {
        $query = DiagnosticRequest::query();
        if ($request->has('type')) {
            $query->where('test_type', $request->query('type'));
        }
        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'patient_name' => 'required|string',
                'test_type' => 'required|string',
                'doctor_name' => 'required|string',
                'clinical_notes' => 'nullable|string',
                'status' => 'nullable|string',
                'results' => 'nullable|string',
            ]);

            $diagnostic = DiagnosticRequest::create($validated);
            return response()->json($diagnostic, 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $diagnostic = DiagnosticRequest::findOrFail($id);
            $diagnostic->update($request->all());
            return response()->json($diagnostic);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}