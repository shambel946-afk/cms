<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('diagnostic_requests', function (Blueprint $table) {
            $table->id();
            $table->string('patient_name');
            $table->string('test_type'); // 'X-Ray', 'Ultrasound', 'Laboratory'
            $table->string('doctor_name');
            $table->text('clinical_notes')->nullable();
            $table->string('status')->default('Pending'); // Pending, Completed
            $table->text('results')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('diagnostic_requests');
    }
};