<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiagnosticRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_name',
        'test_type',
        'doctor_name',
        'clinical_notes',
        'status',
        'results'
    ];
}