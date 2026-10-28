<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('age');
            $table->string('gender')->nullable();
            $table->string('condition');
            $table->string('doctor')->nullable();
            $table->date('appointment_date')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('Under Observation');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('patients');
    }
};