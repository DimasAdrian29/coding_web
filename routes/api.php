<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\BabController;
use App\Http\Controllers\Api\LatihanController;
use App\Http\Controllers\Api\GuruStatisticsController;
use App\Http\Controllers\Api\MateriController;
use App\Http\Controllers\Api\KuisController;
use App\Http\Controllers\Api\SoalKuisController;
use App\Http\Controllers\Api\StudentMateriController;
use App\Http\Controllers\Api\BabSiswaController;
use App\Http\Controllers\Api\DashboardSiswaController;
use App\Http\Controllers\Api\LatihanSiswaController;
use App\Http\Controllers\Api\NilaiSiswaController;
use App\Http\Controllers\Api\ProfilSiswaController;
use App\Http\Controllers\Api\SiswaGuruController;
use App\Http\Controllers\Api\BabGuruController;
use App\Http\Controllers\Api\DashboardGuruController;
use App\Http\Controllers\Api\LatihanGuruController;
use App\Http\Controllers\Api\TeacherExportController;
use App\Http\Controllers\Api\NilaiGuruController;
use App\Http\Controllers\Api\TeacherProfileController;
use App\Http\Controllers\StudentLearningController;
use App\Http\Controllers\TeacherContentController;
use Illuminate\Support\Facades\Route;

Route::middleware('web')->group(function () {
    Route::post('/register', [AuthController::class, 'registerSiswa']);
    Route::post('/register-siswa', [AuthController::class, 'registerSiswa']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

Route::prefix('/student')->group(function () {
    Route::get('/dashboard', DashboardSiswaController::class);
    Route::get('/materis', [BabSiswaController::class, 'materis']);
    Route::get('/materis/{id}/chapter-exercises', [LatihanSiswaController::class, 'materialChapterExercises']);
    Route::get('/materis/{id}/final-exam', [LatihanSiswaController::class, 'materialFinalExam']);
    Route::get('/learning-flow', [BabSiswaController::class, 'learningFlow']);
    Route::get('/chapters', [BabSiswaController::class, 'index']);
    Route::get('/chapters/{id}', [BabSiswaController::class, 'show']);
    Route::post('/chapters/{id}/complete', [BabSiswaController::class, 'complete']);
    Route::post('/chapters/{id}/progress', [BabSiswaController::class, 'updateProgress']);
    Route::get('/exercises', [LatihanSiswaController::class, 'index']);
    Route::get('/exercises/{id}/attempts', [LatihanSiswaController::class, 'attempts']);
    Route::get('/exercises/{id}/submission', [LatihanSiswaController::class, 'submission']);
    Route::get('/exercises/{id}', [LatihanSiswaController::class, 'show']);
    Route::post('/exercises/{id}/submit', [LatihanSiswaController::class, 'submit']);
    Route::get('/final-exam/access', [LatihanSiswaController::class, 'finalExamAccess']);
    Route::get('/final-exam', [LatihanSiswaController::class, 'finalExam']);
    Route::get('/final-exam/{id}/result', [LatihanSiswaController::class, 'finalExamResult']);
    Route::get('/final-exam/{id}', [LatihanSiswaController::class, 'finalExamShow']);
    Route::post('/final-exam/{id}/submit', [LatihanSiswaController::class, 'submitFinalExam']);
    Route::get('/scores', [NilaiSiswaController::class, 'scores']);
    Route::get('/grades', NilaiSiswaController::class);
    Route::get('/profile', ProfilSiswaController::class);
    Route::put('/profile', [ProfilSiswaController::class, 'update']);
    Route::put('/profile/password', [ProfilSiswaController::class, 'updatePassword']);
});

Route::prefix('/siswa')->group(function () {
    Route::post('/bab/{id}/selesai', [BabSiswaController::class, 'complete']);
    Route::get('/profil', ProfilSiswaController::class);
    Route::put('/profil', [ProfilSiswaController::class, 'update']);
    Route::put('/password', [ProfilSiswaController::class, 'updatePassword']);
});

Route::prefix('/teacher')->group(function () {
    Route::get('/dashboard', DashboardGuruController::class);
    Route::get('/chapters', [BabGuruController::class, 'index']);
    Route::post('/chapters', [BabGuruController::class, 'store']);
    Route::get('/chapters/{id}', [BabGuruController::class, 'show']);
    Route::put('/chapters/{id}', [BabGuruController::class, 'update']);
    Route::delete('/chapters/{id}', [BabGuruController::class, 'destroy']);

    Route::get('/exercises', [LatihanGuruController::class, 'index']);
    Route::get('/materi', [LatihanGuruController::class, 'materi']);
    Route::get('/materi/{materiId}/bab', [LatihanGuruController::class, 'babByMateri']);
    Route::get('/materi/{materiId}/latihan-bab', [LatihanGuruController::class, 'latihanBabByMateri']);
    Route::get('/materi/{materiId}/latihan-akhir', [LatihanGuruController::class, 'latihanAkhirByMateri']);
    Route::post('/exercises', [LatihanGuruController::class, 'store']);
    Route::delete('/exercise-attempts/{attemptId}', [LatihanGuruController::class, 'destroyAttempt']);
    Route::get('/statistics/students/{studentId}/history', [NilaiGuruController::class, 'history']);
    Route::get('/statistics/export/pdf', [NilaiGuruController::class, 'exportPdf']);
    Route::get('/statistics/export/excel', [NilaiGuruController::class, 'exportExcel']);
    Route::get('/statistics', [NilaiGuruController::class, 'index']);
    Route::get('/grades', [NilaiGuruController::class, 'index']);
    Route::get('/grades/export/pdf', [NilaiGuruController::class, 'exportPdf']);
    Route::get('/grades/export/excel', [NilaiGuruController::class, 'exportExcel']);
    Route::get('/students', [SiswaGuruController::class, 'index']);
    Route::put('/students/{studentId}', [SiswaGuruController::class, 'update']);
    Route::patch('/students/{studentId}/reset-password', [SiswaGuruController::class, 'resetPassword']);
    Route::delete('/students/{studentId}', [SiswaGuruController::class, 'destroy']);
    Route::get('/exercises/{id}', [LatihanGuruController::class, 'show']);
    Route::put('/exercises/{id}', [LatihanGuruController::class, 'update']);
    Route::delete('/exercises/{id}', [LatihanGuruController::class, 'destroy']);
    Route::get('/exercises/{id}/questions', [LatihanGuruController::class, 'questions']);
    Route::post('/exercises/{id}/questions', [LatihanGuruController::class, 'storeQuestion']);
    Route::put('/questions/{id}', [LatihanGuruController::class, 'updateQuestion']);
    Route::delete('/questions/{id}', [LatihanGuruController::class, 'destroyQuestion']);

    Route::get('/profile', [TeacherProfileController::class, 'show']);
    Route::put('/profile', [TeacherProfileController::class, 'update']);
    Route::post('/profile/photo', [TeacherProfileController::class, 'uploadPhoto']);
    Route::put('/profile/password', [TeacherProfileController::class, 'updatePassword']);

    Route::get('/exports/student-grades/pdf', [TeacherExportController::class, 'studentGradesPdf']);
    Route::get('/exports/student-grades/excel', [TeacherExportController::class, 'studentGradesExcel']);
    Route::get('/exports/submissions/pdf', [TeacherExportController::class, 'submissionsPdf']);
    Route::get('/exports/submissions/excel', [TeacherExportController::class, 'submissionsExcel']);
    Route::get('/exports/statistics/pdf', [TeacherExportController::class, 'statisticsPdf']);
    Route::get('/exports/statistics/excel', [TeacherExportController::class, 'statisticsExcel']);
});

Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/materials', [MateriController::class, 'index']);
    Route::post('/materials', [MateriController::class, 'store']);
    Route::put('/materials/{id}', [MateriController::class, 'update']);
    Route::delete('/materials/{id}', [MateriController::class, 'destroy']);

    Route::post('/materials/{id}/chapters', [BabController::class, 'store']);
    Route::put('/chapters/{id}', [BabController::class, 'update']);
    Route::delete('/chapters/{id}', [BabController::class, 'destroy']);

    Route::post('/chapters/{id}/exercises', [LatihanController::class, 'store']);
    Route::put('/exercises/{id}', [LatihanController::class, 'update']);
    Route::delete('/exercises/{id}', [LatihanController::class, 'destroy']);

    Route::post('/materials/{id}/quiz', [KuisController::class, 'store']);
    Route::put('/quizzes/{id}', [KuisController::class, 'update']);
    Route::delete('/quizzes/{id}', [KuisController::class, 'destroy']);

    Route::post('/quizzes/{id}/questions', [SoalKuisController::class, 'store']);
    Route::put('/quiz-questions/{id}', [SoalKuisController::class, 'update']);
    Route::delete('/quiz-questions/{id}', [SoalKuisController::class, 'destroy']);

    Route::prefix('/legacy-student')->group(function () {
        Route::get('/materials', [StudentMateriController::class, 'index']);
        Route::get('/materials/{id}', [StudentMateriController::class, 'show']);
        Route::post('/materials/{id}/start', [StudentMateriController::class, 'start']);
        Route::get('/materials/{id}/quiz', [StudentMateriController::class, 'showQuiz']);
        Route::post('/materials/{id}/quiz/submit', [StudentMateriController::class, 'submitQuiz']);
        Route::get('/chapters/{id}', [StudentMateriController::class, 'showChapter']);
        Route::post('/chapters/{id}/complete', [StudentMateriController::class, 'completeChapter']);
        Route::get('/chapters/{id}/exercises', [StudentMateriController::class, 'showExercises']);
        Route::post('/chapters/{id}/exercises/submit', [StudentMateriController::class, 'submitExercises']);
    });

    Route::get('/materi', [StudentLearningController::class, 'indexMaterials']);
    Route::get('/materi/{id}/bab', [StudentLearningController::class, 'materialBabs']);
    Route::get('/bab/{id}', [StudentLearningController::class, 'showBab']);
    Route::post('/bab/{id}/complete', [StudentLearningController::class, 'completeBab']);
    Route::get('/bab/{id}/exercise', [StudentLearningController::class, 'showExercise']);
    Route::post('/bab/{id}/exercise/submit', [StudentLearningController::class, 'submitExercise']);
    Route::get('/bab/{id}/quiz', [StudentLearningController::class, 'showQuiz']);
    Route::post('/bab/{id}/quiz/submit', [StudentLearningController::class, 'submitQuiz']);

    Route::prefix('/guru')->group(function () {
        Route::get('/dashboard', [TeacherContentController::class, 'dashboard']);
        Route::get('/materi', [LatihanGuruController::class, 'materi']);
        Route::get('/materi/{materiId}/bab', [LatihanGuruController::class, 'babByMateri']);
        Route::get('/materi/{materiId}/latihan-bab', [LatihanGuruController::class, 'latihanBabByMateri']);
        Route::get('/materi/{materiId}/latihan-akhir', [LatihanGuruController::class, 'latihanAkhirByMateri']);
        Route::get('/materials', [TeacherContentController::class, 'materials']);
        Route::get('/babs', [TeacherContentController::class, 'babs']);
        Route::get('/exercises', [TeacherContentController::class, 'exercises']);
        Route::get('/quizzes', [TeacherContentController::class, 'quizzes']);
        Route::get('/statistics', [GuruStatisticsController::class, 'index']);
        Route::get('/statistik', [GuruStatisticsController::class, 'index']);
        Route::get('/student-stats', [GuruStatisticsController::class, 'index']);
    });
});
