<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/login');
});

Route::get('/login', function () {
    return view('app');
});

Route::get('/register', function () {
    return view('app');
});

Route::get('/forgot-password', function () {
    return view('app');
});

Route::get('/reset-password/{token}', function () {
    return view('app');
})->name('password.reset');

Route::get('/guru/dashboard', function () {
    return view('app');
})->name('guru.dashboard');

Route::get('/guru/materi', function () {
    return view('app');
})->name('guru.materi');

Route::get('/guru/bab', function () {
    return view('app');
})->name('guru.bab');

Route::get('/guru/latihan', function () {
    return view('app');
})->name('guru.latihan');

Route::get('/guru/quiz', function () {
    return view('app');
});

Route::get('/guru/penilaian', function () {
    return view('app');
});

Route::get('/guru/statistik', function () {
    return view('app');
})->name('guru.statistik');

Route::get('/guru/profil', function () {
    return view('app');
});

Route::get('/siswa/dashboard', function () {
    return view('app');
})->name('siswa.dashboard');

Route::get('/siswa', function () {
    return view('app');
})->name('siswa.materi');

Route::get('/siswa/materi', function () {
    return view('app');
});

Route::get('/siswa/materi/{id}', function () {
    return view('app');
});

Route::get('/siswa/materi/{id}/quiz', function () {
    return view('app');
});

Route::get('/siswa/bab/{id}', function () {
    return view('app');
});

Route::get('/siswa/bab/{id}/latihan', function () {
    return view('app');
});

Route::get('/siswa/bab/{id}/quiz', function () {
    return view('app');
});

Route::get('/siswa/latihan-bab', function () {
    return view('app');
});

Route::get('/siswa/latihan-bab/{id}', function () {
    return view('app');
});

Route::get('/siswa/latihan-bab/{id}/hasil', function () {
    return view('app');
});

Route::get('/siswa/latihan-akhir', function () {
    return view('app');
});

Route::get('/siswa/latihan-akhir/{id}', function () {
    return view('app');
});

Route::get('/siswa/latihan-akhir/{id}/hasil', function () {
    return view('app');
});

Route::get('/siswa/nilai-progress', function () {
    return view('app');
})->name('siswa.nilai');

Route::get('/siswa/profil', function () {
    return view('app');
});

Route::get('/dashboard-guru', function () {
    return view('app');
});

Route::get('/dashboard-guru/profil', function () {
    return view('app');
});

Route::get('/dashboard-guru/materi', function () {
    return view('app');
});

Route::get('/dashboard-guru/materi/bab', function () {
    return view('app');
});

Route::get('/dashboard-guru/bab-pembelajaran', function () {
    return view('app');
});

Route::get('/dashboard-guru/latihan', function () {
    return view('app');
});

Route::get('/dashboard-guru/quiz', function () {
    return view('app');
});

Route::get('/dashboard-guru/penilaian', function () {
    return view('app');
});

Route::get('/dashboard-guru/statistik-siswa', function () {
    return view('app');
});

Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api).*$');
