<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('patient_name');
            $table->string('service_type'); // e.g., Consultation, Pharmacy, Lab
            $table->decimal('amount', 10, 2);
            $table->string('payment_method')->default('Cash'); // Cash, Mobile Money, Card
            $table->string('status')->default('Paid'); // Paid, Pending
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('payments');
    }
};