<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('medicines', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category')->default('General');
            $table->integer('stock')->default(0);
            $table->decimal('unit_price', 10, 2);
            $table->string('dosage')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('medicines');
    }
};