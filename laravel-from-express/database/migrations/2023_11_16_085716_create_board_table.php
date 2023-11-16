<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('board', function (Blueprint $table) {
            $table->id() ->comment('보드 id');
            $table->string('name', 255)->comment('보드명');
            $table->enum('privacy',['public','secret'])->comment('보드의 공개 여부');
            $table->boolean('is_delete')->comment('보드 삭제 여부');
            $table->timestamps(); //created_at, updated_at TIMESTAMP에 해당하는 컬럼 생성

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('board');
    }
};
