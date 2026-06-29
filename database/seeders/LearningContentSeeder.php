<?php

namespace Database\Seeders;

use App\Models\BabLama;
use App\Models\MateriLama;
use Illuminate\Database\Seeder;

class LearningContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $materials = [
            [
                'title' => 'JavaScript Dasar',
                'slug' => 'javascript-dasar',
                'description' => 'MateriLama dasar JavaScript untuk memahami variabel, percabangan, perulangan, function, dan array.',
                'estimated_duration' => '5 BabLama',
                'babs' => [
                    [
                        'title' => 'Pengenalan Variabel',
                        'slug' => 'js-variabel',
                        'description' => 'Memahami cara menyimpan data di dalam variabel.',
                        'content' => 'Pada BabLama ini siswa mempelajari konsep variabel, aturan penamaan, dan penggunaan let serta const dalam JavaScript.',
                        'code_example' => "const nama = 'Rina';\nlet umur = 16;\nconsole.log(nama, umur);",
                        'exercise_title' => 'Latihan Variabel',
                        'exercise_prompt' => 'Tuliskan kata kunci JavaScript yang digunakan untuk membuat variabel yang nilainya bisa diubah.',
                        'exercise_answer' => 'let',
                        'exercise_questions' => $this->buildQuestions([
                            ['Apa keyword untuk membuat variabel yang nilainya bisa diubah?', 'const', 'let', 'var()', 'define', 'b'],
                            ['Mana penulisan variabel yang benar di JavaScript?', 'let namaSiswa = "Rina";', 'let 1nama = "Rina";', 'variable nama = "Rina";', 'string nama = "Rina";', 'a'],
                            ['Keyword mana yang dipakai untuk variabel bernilai tetap?', 'let', 'var', 'const', 'fixed', 'c'],
                            ['Output dari `const nama = "Budi"; console.log(nama);` adalah?', 'undefined', 'Budi', 'nama', 'error selalu', 'b'],
                            ['Karakter apa yang tidak boleh di awal nama variabel?', 'Huruf', 'Underscore', 'Angka', 'Dollar sign', 'c'],
                            ['Manakah contoh nama variabel yang paling baik?', 'x1', 'nama_siswa', 'data', 'abc', 'b'],
                            ['Fungsi utama variabel dalam pemrograman adalah?', 'Menghias tampilan', 'Menyimpan data', 'Menghapus file', 'Menjalankan browser', 'b'],
                            ['`let umur = 16;` berarti nilai yang disimpan adalah tipe...', 'string', 'boolean', 'number', 'array', 'c'],
                            ['Mana yang termasuk deklarasi variabel?', 'console.log("hai")', 'let kota = "Pekanbaru";', 'if (true) {}', 'return nilai;', 'b'],
                            ['Jika nilai variabel perlu diubah nanti, sebaiknya gunakan...', 'const', 'let', 'class', 'import', 'b'],
                        ]),
                        'quiz_title' => 'Quiz Variabel',
                        'quiz_questions' => $this->buildQuestions([
                            ['Variabel dengan nilai tetap sebaiknya dibuat dengan...', 'let', 'const', 'var', 'loop', 'b'],
                            ['Keyword untuk variabel yang bisa berubah adalah...', 'static', 'const', 'let', 'return', 'c'],
                            ['Nama variabel yang valid adalah...', '1nilai', 'nilai_siswa', 'nilai siswa', 'class', 'b'],
                            ['Variabel dipakai untuk...', 'Menyimpan data', 'Menghapus file', 'Mewarnai tombol', 'Membuat route', 'a'],
                            ['Hasil `let x = 5; x = 7;` menunjukkan bahwa...', 'let bisa diubah', 'let selalu error', 'x tidak punya nilai', '7 tidak valid', 'a'],
                        ]),
                        'order_number' => 1,
                    ],
                    [
                        'title' => 'Tipe Data dan Operator',
                        'slug' => 'js-tipe-data-operator',
                        'description' => 'Belajar number, string, boolean, dan operator dasar.',
                        'content' => 'Siswa belajar membedakan tipe data dasar dan menggunakannya bersama operator aritmatika dan logika.',
                        'code_example' => "const angka = 10;\nconst teks = 'SMK';\nconsole.log(angka + 5);\nconsole.log(teks + ' Negeri 5');",
                        'exercise_title' => 'Latihan Tipe Data',
                        'exercise_prompt' => 'Sebutkan tipe data JavaScript untuk nilai benar atau salah.',
                        'exercise_answer' => 'boolean',
                        'exercise_questions' => $this->buildQuestions([
                            ['Tipe data untuk nilai `true` dan `false` adalah...', 'string', 'boolean', 'number', 'object', 'b'],
                            ['Hasil dari `5 + 2` adalah...', '52', '7', '3', '10', 'b'],
                            ['Nilai `"SMK"` termasuk tipe data...', 'number', 'boolean', 'string', 'array', 'c'],
                            ['Operator untuk penjumlahan adalah...', '-', '/', '+', '==', 'c'],
                            ['Operator untuk membandingkan dua nilai sama adalah...', '=', '==', '+=', '=>', 'b'],
                            ['Hasil `10 > 7` bernilai...', '"true"', '1', 'true', 'falsey', 'c'],
                            ['`const aktif = false;` berarti `aktif` bertipe...', 'boolean', 'string', 'number', 'null', 'a'],
                            ['Operator logika AND di JavaScript adalah...', '||', '&&', '??', '!!', 'b'],
                            ['Tipe data untuk angka bulat dan desimal di JavaScript adalah...', 'int', 'float', 'number', 'digit', 'c'],
                            ['Hasil `"5" + 2` di JavaScript menjadi...', '7', '52', 'error', 'undefined', 'b'],
                        ]),
                        'quiz_title' => 'Quiz Operator',
                        'quiz_questions' => $this->buildQuestions([
                            ['Tipe data untuk teks adalah...', 'number', 'string', 'boolean', 'null', 'b'],
                            ['Hasil `10 - 4` adalah...', '6', '14', '104', '5', 'a'],
                            ['Operator OR di JavaScript adalah...', '&&', '||', '==', '!=', 'b'],
                            ['Nilai `false && true` menghasilkan...', 'true', 'false', '1', 'undefined', 'b'],
                            ['Nilai `"8" + 1` di JavaScript menjadi...', '9', '81', 'error', '7', 'b'],
                        ]),
                        'order_number' => 2,
                    ],
                    [
                        'title' => 'Percabangan If Else',
                        'slug' => 'js-percabangan',
                        'description' => 'Menentukan alur program berdasarkan kondisi.',
                        'content' => 'MateriLama ini membahas if, else if, dan else untuk membuat keputusan di dalam program.',
                        'code_example' => "const nilai = 82;\nif (nilai >= 75) {\n  console.log('Lulus');\n} else {\n  console.log('Belum lulus');\n}",
                        'exercise_title' => 'Latihan Percabangan',
                        'exercise_prompt' => 'Tuliskan keyword JavaScript yang dipakai untuk membuat kondisi alternatif ketika syarat utama tidak terpenuhi.',
                        'exercise_answer' => 'else',
                        'exercise_questions' => $this->buildQuestions([
                            ['Keyword utama untuk membuat percabangan adalah...', 'for', 'if', 'switcher', 'loop', 'b'],
                            ['Blok kode alternatif saat kondisi salah menggunakan...', 'else', 'return', 'break', 'catch', 'a'],
                            ['`else if` dipakai ketika...', 'Mengulang kode', 'Menambahkan kondisi lain', 'Menyimpan data', 'Membuat array', 'b'],
                            ['Jika `nilai >= 75`, maka kondisi tersebut disebut...', 'ekspresi', 'parameter', 'syarat', 'variabel', 'c'],
                            ['Manakah contoh percabangan yang benar?', 'if nilai > 70 {}', 'if (nilai > 70) {}', 'if {nilai > 70}', 'if: nilai > 70', 'b'],
                            ['Tujuan percabangan dalam program adalah...', 'Mengatur keputusan', 'Membuat desain', 'Menghapus CSS', 'Mengurutkan file', 'a'],
                            ['`if (umur >= 17)` akan menjalankan blok jika...', 'umur kurang dari 17', 'umur sama atau lebih dari 17', 'umur bukan angka', 'selalu dijalankan', 'b'],
                            ['Kondisi di dalam `if (...)` harus menghasilkan...', 'string', 'boolean', 'array', 'object', 'b'],
                            ['Keyword mana yang tidak terkait percabangan?', 'if', 'else', 'else if', 'while', 'd'],
                            ['Saat semua kondisi tidak terpenuhi, blok yang berjalan adalah...', 'if', 'else', 'break', 'continue', 'b'],
                        ]),
                        'quiz_title' => 'Quiz If Else',
                        'quiz_questions' => $this->buildQuestions([
                            ['Percabangan dipakai untuk...', 'Mengulang kode', 'Membuat keputusan', 'Mengimpor file', 'Menghapus data', 'b'],
                            ['Blok `else` berjalan ketika...', 'Kondisi benar', 'Kondisi salah', 'Loop selesai', 'Array kosong', 'b'],
                            ['`else if` digunakan untuk...', 'Menambah kondisi lanjutan', 'Menghapus kondisi', 'Membuat function', 'Membuat array', 'a'],
                            ['Kondisi pada `if` harus bernilai...', 'boolean', 'array', 'object', 'CSS', 'a'],
                            ['Manakah struktur yang benar?', 'if nilai > 70', 'if (nilai > 70) {}', 'if {nilai > 70}', 'if => nilai > 70', 'b'],
                        ]),
                        'order_number' => 3,
                    ],
                    [
                        'title' => 'Perulangan Loop',
                        'slug' => 'js-perulangan',
                        'description' => 'Mengulang blok kode dengan efisien.',
                        'content' => 'Siswa mengenal for, while, dan cara memilih struktur loop yang tepat.',
                        'code_example' => "for (let i = 1; i <= 3; i++) {\n  console.log('Iterasi ke-' + i);\n}",
                        'exercise_title' => 'Latihan Loop',
                        'exercise_prompt' => 'Tuliskan keyword JavaScript untuk perulangan yang biasanya dipakai ketika jumlah iterasi sudah diketahui.',
                        'exercise_answer' => 'for',
                        'exercise_questions' => $this->buildQuestions([
                            ['Keyword umum untuk perulangan dengan jumlah iterasi jelas adalah...', 'if', 'for', 'const', 'case', 'b'],
                            ['Bagian `i++` pada `for` berfungsi untuk...', 'Membandingkan nilai', 'Menambah nilai iterasi', 'Menyimpan string', 'Menghentikan program', 'b'],
                            ['Perulangan `while` akan terus berjalan selama...', 'kondisi bernilai true', 'browser aktif', 'angka selalu 0', 'ada fungsi', 'a'],
                            ['Output `for (let i=1; i<=3; i++) console.log(i)` adalah...', '1 2 3', '0 1 2', '3 2 1', '1 2 3 4', 'a'],
                            ['Loop digunakan ketika kita ingin...', 'Mengulang blok kode', 'Mengganti warna teks', 'Membuat database', 'Menyisipkan gambar', 'a'],
                            ['Mana yang merupakan kondisi pada `for`?', 'let i = 0', 'i <= 5', 'i++', 'console.log(i)', 'b'],
                            ['Jika kondisi loop salah sejak awal, maka...', 'loop tetap berjalan', 'loop error', 'loop tidak dijalankan', 'browser mati', 'c'],
                            ['Keyword untuk melewati satu iterasi adalah...', 'continue', 'return', 'throw', 'yield', 'a'],
                            ['Keyword untuk menghentikan loop lebih cepat adalah...', 'stop', 'end', 'break', 'finish', 'c'],
                            ['Perulangan cocok dipakai untuk...', 'Menampilkan daftar data berulang', 'Membuat password reset', 'Menyalin folder manual', 'Menghapus login', 'a'],
                        ]),
                        'quiz_title' => 'Quiz Loop',
                        'quiz_questions' => $this->buildQuestions([
                            ['Loop `for` cocok untuk...', 'Percabangan', 'Iterasi terhitung', 'Styling CSS', 'Upload file', 'b'],
                            ['Keyword untuk menghentikan loop adalah...', 'break', 'stop', 'skip', 'pause', 'a'],
                            ['`continue` digunakan untuk...', 'Keluar dari program', 'Melewati iterasi saat ini', 'Menambah array', 'Menghapus fungsi', 'b'],
                            ['`while` berjalan selama kondisi...', 'false', 'true', 'null', 'angka negatif', 'b'],
                            ['Loop berguna untuk...', 'Mengulang proses', 'Mengganti database', 'Membuat login', 'Menghapus sidebar', 'a'],
                        ]),
                        'order_number' => 4,
                    ],
                    [
                        'title' => 'Function dan Array',
                        'slug' => 'js-function-array',
                        'description' => 'Membuat fungsi reusable dan mengelola kumpulan data.',
                        'content' => 'Pada tahap ini siswa belajar function dasar, parameter, return value, dan operasi array sederhana.',
                        'code_example' => "function salam(nama) {\n  return `Halo, \${nama}`;\n}\nconst daftar = ['Ani', 'Budi'];\nconsole.log(salam(daftar[0]));",
                        'exercise_title' => 'Latihan Function & Array',
                        'exercise_prompt' => 'Tuliskan keyword JavaScript untuk mendeklarasikan sebuah fungsi.',
                        'exercise_answer' => 'function',
                        'exercise_questions' => $this->buildQuestions([
                            ['Keyword untuk mendeklarasikan fungsi adalah...', 'func', 'method', 'function', 'define', 'c'],
                            ['Parameter pada function digunakan untuk...', 'Menerima nilai input', 'Menghapus variabel', 'Mewarnai halaman', 'Menutup loop', 'a'],
                            ['`return` pada function berfungsi untuk...', 'Mengulang fungsi', 'Mengembalikan hasil', 'Menghapus array', 'Menyimpan CSS', 'b'],
                            ['Array digunakan untuk...', 'Menyimpan banyak data dalam satu variabel', 'Menghapus nilai boolean', 'Mengganti tag HTML', 'Membuat login', 'a'],
                            ['Index pertama pada array adalah...', '1', '0', '-1', '2', 'b'],
                            ['`buah.push("Mangga")` berfungsi untuk...', 'Menghapus data', 'Menambah data ke array', 'Mengurutkan array', 'Mencetak array', 'b'],
                            ['Contoh function yang benar adalah...', 'function sapa() {}', 'func sapa[]', 'function = sapa', 'def sapa()', 'a'],
                            ['Untuk mengambil data pertama array `daftar`, kita gunakan...', 'daftar(0)', 'daftar[1]', 'daftar[0]', 'daftar.first', 'c'],
                            ['Array `["A", "B", "C"]` memiliki panjang...', '2', '3', '4', '1', 'b'],
                            ['Function membantu kode menjadi...', 'Lebih sulit dibaca', 'Repetitif', 'Reusable', 'Tidak bisa dipakai ulang', 'c'],
                        ]),
                        'quiz_title' => 'Quiz Function & Array',
                        'quiz_questions' => $this->buildQuestions([
                            ['Function dipakai agar kode...', 'Lebih berulang manual', 'Bisa digunakan ulang', 'Tidak terbaca', 'Selalu error', 'b'],
                            ['Keyword `return` berguna untuk...', 'Mengembalikan hasil function', 'Menghapus array', 'Menutup browser', 'Membuat warna', 'a'],
                            ['Array menyimpan...', 'Satu nilai saja', 'Banyak nilai dalam satu variabel', 'Hanya angka', 'Hanya teks', 'b'],
                            ['Index pertama array adalah...', '1', '0', '2', '-1', 'b'],
                            ['Method untuk menambah elemen ke akhir array adalah...', 'push()', 'pop()', 'shift()', 'slice()', 'a'],
                        ]),
                        'order_number' => 5,
                    ],
                ],
            ],
            [
                'title' => 'HTML dan CSS Dasar',
                'slug' => 'html-css-dasar',
                'description' => 'Belajar struktur halaman web dan styling dasar untuk membangun antarmuka yang rapi.',
                'estimated_duration' => '4 BabLama',
                'babs' => [
                    [
                        'title' => 'Struktur HTML',
                        'slug' => 'html-struktur-dasar',
                        'description' => 'Mengenal elemen dasar HTML.',
                        'content' => 'Siswa mempelajari tag dasar seperti heading, paragraph, list, link, dan image untuk membentuk struktur halaman.',
                        'code_example' => "<h1>Halo Dunia</h1>\n<p>Belajar HTML dasar.</p>",
                        'exercise_title' => 'Latihan Struktur HTML',
                        'exercise_prompt' => 'Tag HTML apa yang digunakan untuk membuat paragraf?',
                        'exercise_answer' => '<p>',
                        'exercise_questions' => $this->buildQuestions([
                            ['Tag untuk membuat paragraf adalah...', '<h1>', '<p>', '<div>', '<span>', 'b'],
                            ['Tag untuk judul terbesar biasanya adalah...', '<title>', '<head>', '<h1>', '<p>', 'c'],
                            ['Elemen HTML ditulis menggunakan...', 'Kurung siku', 'Kurung biasa', 'Tag', 'Petik', 'c'],
                            ['Tag untuk membuat tautan/link adalah...', '<a>', '<img>', '<ul>', '<li>', 'a'],
                            ['Atribut untuk alamat tujuan link adalah...', 'src', 'class', 'href', 'id', 'c'],
                            ['Tag gambar di HTML adalah...', '<image>', '<img>', '<picture>', '<src>', 'b'],
                            ['Tag daftar tak berurutan adalah...', '<ol>', '<ul>', '<dl>', '<table>', 'b'],
                            ['Tag list item adalah...', '<item>', '<li>', '<list>', '<ul>', 'b'],
                            ['Struktur HTML membantu untuk...', 'Mengatur susunan konten halaman', 'Menjalankan database', 'Membuat API', 'Menyusun tabel MySQL', 'a'],
                            ['Tag pembungkus umum untuk section halaman adalah...', '<div>', '<link>', '<meta>', '<code>', 'a'],
                        ]),
                        'quiz_title' => 'Quiz HTML Dasar',
                        'quiz_questions' => $this->buildQuestions([
                            ['Tag untuk heading utama adalah...', '<h1>', '<p>', '<div>', '<title>', 'a'],
                            ['Tag untuk gambar adalah...', '<img>', '<picturebox>', '<src>', '<media>', 'a'],
                            ['Atribut link tujuan memakai...', 'src', 'href', 'alt', 'class', 'b'],
                            ['Tag daftar urut adalah...', '<ul>', '<ol>', '<dl>', '<li>', 'b'],
                            ['HTML berfungsi untuk...', 'Struktur halaman', 'Logika server', 'Query database', 'Enkripsi password', 'a'],
                        ]),
                        'order_number' => 1,
                    ],
                    [
                        'title' => 'Form dan Input',
                        'slug' => 'html-form-input',
                        'description' => 'Membuat form interaktif untuk pengguna.',
                        'content' => 'BabLama ini membahas form, input text, email, password, dan tombol submit.',
                        'code_example' => "<form>\n  <input type=\"text\" placeholder=\"Nama\" />\n  <button>Kirim</button>\n</form>",
                        'exercise_title' => 'Latihan Form',
                        'exercise_prompt' => 'Tag HTML apa yang digunakan untuk membungkus elemen input agar bisa dikirim?',
                        'exercise_answer' => '<form>',
                        'exercise_questions' => $this->buildQuestions([
                            ['Tag pembungkus form adalah...', '<input>', '<button>', '<form>', '<label>', 'c'],
                            ['Tag untuk kotak input teks adalah...', '<text>', '<input>', '<textarea>', '<field>', 'b'],
                            ['Atribut `type="password"` digunakan untuk...', 'Email', 'Nomor', 'Password tersembunyi', 'Tanggal', 'c'],
                            ['Tombol kirim form biasa menggunakan...', '<submit>', '<button type="submit">', '<send>', '<input type="button">', 'b'],
                            ['Tag untuk area input teks panjang adalah...', '<input>', '<textarea>', '<select>', '<option>', 'b'],
                            ['Label pada form berguna untuk...', 'Menjelaskan input', 'Menyimpan data', 'Menghapus tombol', 'Mengunci halaman', 'a'],
                            ['Dropdown pada form dibuat dengan tag...', '<menu>', '<list>', '<select>', '<choice>', 'c'],
                            ['Pilihan di dalam dropdown memakai tag...', '<item>', '<option>', '<select-item>', '<input>', 'b'],
                            ['Atribut `placeholder` berfungsi untuk...', 'Memberi warna', 'Menampilkan petunjuk singkat', 'Mengirim form', 'Membuat input wajib', 'b'],
                            ['Form interaktif digunakan untuk...', 'Mengambil input dari pengguna', 'Menambah database otomatis', 'Menghapus CSS', 'Menutup browser', 'a'],
                        ]),
                        'quiz_title' => 'Quiz Form HTML',
                        'quiz_questions' => $this->buildQuestions([
                            ['Tag input teks adalah...', '<input>', '<field>', '<type>', '<text>', 'a'],
                            ['Atribut `type=\"email\"` dipakai untuk...', 'Nomor', 'Password', 'Email', 'Tanggal', 'c'],
                            ['Tombol kirim form biasanya memakai...', 'type=\"button\"', 'type=\"submit\"', 'type=\"link\"', 'type=\"send\"', 'b'],
                            ['Dropdown dibuat dengan...', '<select>', '<optionbox>', '<menu>', '<dropdown>', 'a'],
                            ['Form dipakai untuk...', 'Input pengguna', 'Styling halaman', 'Routing', 'Migrasi database', 'a'],
                        ]),
                        'order_number' => 2,
                    ],
                    [
                        'title' => 'CSS Selector dan Warna',
                        'slug' => 'css-selector-warna',
                        'description' => 'Memberi tampilan visual pada elemen HTML.',
                        'content' => 'Siswa mengenal selector, warna, background, dan font untuk mempercantik halaman.',
                        'code_example' => "body {\n  background: #f7f7f6;\n  color: #1e293b;\n}",
                        'exercise_title' => 'Latihan CSS Dasar',
                        'exercise_prompt' => 'Property CSS apa yang digunakan untuk mengubah warna teks?',
                        'exercise_answer' => 'color',
                        'exercise_questions' => $this->buildQuestions([
                            ['Property CSS untuk warna teks adalah...', 'background', 'font-color', 'color', 'text-style', 'c'],
                            ['Property untuk warna latar belakang adalah...', 'background', 'fill', 'color-bg', 'border', 'a'],
                            ['CSS digunakan untuk...', 'Menyusun logika program', 'Mengatur tampilan elemen', 'Menyimpan data', 'Membuat route', 'b'],
                            ['Selector untuk elemen body adalah...', '.body', '#body', 'body', '*body', 'c'],
                            ['Tanda `#` pada CSS biasa dipakai untuk memilih...', 'class', 'tag', 'id', 'semua elemen', 'c'],
                            ['Tanda `.` pada CSS dipakai untuk memilih...', 'class', 'id', 'body', 'table', 'a'],
                            ['Property untuk ukuran huruf adalah...', 'font-size', 'text-weight', 'size-text', 'font-scale', 'a'],
                            ['Property untuk ketebalan huruf adalah...', 'font-width', 'font-weight', 'text-bold', 'weight', 'b'],
                            ['Nilai warna hex biasanya diawali dengan...', '&', '$', '#', '@', 'c'],
                            ['CSS membantu halaman menjadi...', 'Lebih rapi dan menarik', 'Lebih lambat selalu', 'Tidak punya warna', 'Tidak bisa dibaca', 'a'],
                        ]),
                        'quiz_title' => 'Quiz Selector CSS',
                        'quiz_questions' => $this->buildQuestions([
                            ['Selector class diawali dengan...', '#', '.', '@', '&', 'b'],
                            ['Selector id diawali dengan...', '.', '#', '$', ':', 'b'],
                            ['Property untuk ukuran font adalah...', 'font-size', 'text-size', 'size', 'font-style', 'a'],
                            ['Property untuk background adalah...', 'bg-color', 'background', 'fill', 'paint', 'b'],
                            ['CSS dipakai untuk...', 'Mengatur tampilan', 'Menyimpan data', 'Membuat route', 'Menghitung nilai', 'a'],
                        ]),
                        'order_number' => 3,
                    ],
                    [
                        'title' => 'Layout Flexbox',
                        'slug' => 'css-flexbox',
                        'description' => 'Menyusun layout responsif dengan flexbox.',
                        'content' => 'MateriLama ini mengajarkan display flex, justify-content, align-items, dan gap.',
                        'code_example' => ".container {\n  display: flex;\n  justify-content: space-between;\n  gap: 16px;\n}",
                        'exercise_title' => 'Latihan Flexbox',
                        'exercise_prompt' => 'Nilai property display apa yang digunakan untuk mengaktifkan flexbox?',
                        'exercise_answer' => 'flex',
                        'exercise_questions' => $this->buildQuestions([
                            ['Untuk mengaktifkan flexbox, gunakan `display: ...`', 'block', 'grid', 'flex', 'inline', 'c'],
                            ['Property untuk mengatur posisi horizontal item adalah...', 'align-items', 'justify-content', 'flex-wrap', 'gap', 'b'],
                            ['Property untuk mengatur posisi vertikal item adalah...', 'justify-content', 'align-items', 'display', 'padding', 'b'],
                            ['Property untuk memberi jarak antar item flex adalah...', 'gap', 'space', 'margin-auto', 'distance', 'a'],
                            ['Flexbox cocok untuk...', 'Layout satu dimensi', 'Query database', 'Membuat login', 'Menjalankan PHP', 'a'],
                            ['Nilai `space-between` biasanya dipakai pada...', 'display', 'justify-content', 'align-items', 'position', 'b'],
                            ['Jika item ingin turun ke baris berikutnya, gunakan...', 'flex-wrap', 'align-content', 'overflow', 'wrap-item', 'a'],
                            ['Container flex ditulis pada elemen...', 'Induk', 'Anak terakhir', 'Input', 'Script', 'a'],
                            ['Property `flex-direction: column` membuat item...', 'Berjejer ke samping', 'Berjejer ke bawah', 'Menghilang', 'Membesar otomatis', 'b'],
                            ['Flexbox membantu membuat layout...', 'Responsif dan rapi', 'Tidak teratur', 'Hanya hitam putih', 'Tanpa struktur', 'a'],
                        ]),
                        'quiz_title' => 'Quiz Flexbox',
                        'quiz_questions' => $this->buildQuestions([
                            ['Untuk mengatur arah item flex digunakan...', 'flex-direction', 'justify-content', 'gap', 'wrap', 'a'],
                            ['`justify-content: center` membuat item...', 'Rata kiri', 'Di tengah horizontal', 'Di bawah', 'Mengecil', 'b'],
                            ['`align-items: center` mengatur...', 'Posisi vertikal item', 'Warna item', 'Lebar item', 'Urutan item', 'a'],
                            ['`gap` dipakai untuk...', 'Jarak antar item', 'Menghapus item', 'Mengganti warna', 'Membuat border', 'a'],
                            ['Flexbox sangat cocok untuk...', 'Layout komponen responsif', 'Menghapus database', 'Membuat login API', 'Menyusun migration', 'a'],
                        ]),
                        'order_number' => 4,
                    ],
                ],
            ],
        ];

        foreach ($materials as $materialData) {
            $babs = $materialData['babs'];
            unset($materialData['babs']);

            $MateriLama = MateriLama::updateOrCreate(
                ['slug' => $materialData['slug']],
                $materialData
            );

            BabLama::where('materi_id', $MateriLama->id)->delete();

            foreach ($babs as $babData) {
                $MateriLama->babs()->create($babData);
            }
        }
    }

    private function buildQuestions(array $questions): array
    {
        return collect($questions)
            ->values()
            ->map(fn (array $item, int $index) => [
                'id' => 'e' . ($index + 1),
                'question' => $item[0],
                'options' => [
                    ['key' => 'a', 'label' => $item[1]],
                    ['key' => 'b', 'label' => $item[2]],
                    ['key' => 'c', 'label' => $item[3]],
                    ['key' => 'd', 'label' => $item[4]],
                ],
                'correct_answer' => $item[5],
            ])
            ->all();
    }
}
