-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 26 Jun 2026 pada 13.44
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_coding_web`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `bab`
--

CREATE TABLE `bab` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `material_id` bigint(20) UNSIGNED NOT NULL,
  `materi_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `video_type` enum('youtube','upload') DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `video_file` varchar(255) DEFAULT NULL,
  `code_example` text DEFAULT NULL,
  `judul_contoh_kode` varchar(255) DEFAULT NULL,
  `bahasa_pemrograman` varchar(50) DEFAULT NULL,
  `contoh_kode` longtext DEFAULT NULL,
  `penjelasan_kode` text DEFAULT NULL,
  `order_number` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `duration_minutes` int(10) UNSIGNED DEFAULT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `chapter_order` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `bab`
--

INSERT INTO `bab` (`id`, `material_id`, `materi_id`, `title`, `description`, `content`, `video_type`, `video_url`, `video_file`, `code_example`, `judul_contoh_kode`, `bahasa_pemrograman`, `contoh_kode`, `penjelasan_kode`, `order_number`, `duration_minutes`, `status`, `created_by`, `chapter_order`, `created_at`, `updated_at`) VALUES
(33, 7, 7, 'BAB 1 : Pengantar Mapel Koding dan Kecerdasan Artifisial', 'Mengenalkan latar belakang, tujuan, karakteristik, dan pentingnya mata pelajaran Koding dan Kecerdasan Artifisial dalam pendidikan Indonesia.', 'Indonesia memasuki era transformasi digital yang membutuhkan sumber daya manusia yang mampu beradaptasi dengan perkembangan teknologi. Mata pelajaran Koding dan Kecerdasan Artifisial hadir untuk membekali peserta didik dengan kemampuan berpikir komputasional, literasi digital, pemrograman, analisis data, dan pemanfaatan kecerdasan artifisial.\r\n\r\nPembelajaran KKA bertujuan membentuk peserta didik yang kreatif, kritis, kolaboratif, dan mampu memanfaatkan teknologi secara bertanggung jawab dalam kehidupan sehari-hari.', 'youtube', 'https://www.youtube.com/watch?v=GFut2yEZM24', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 'published', 1, 1, '2026-06-23 12:26:41', '2026-06-23 12:26:41'),
(34, 7, 7, 'BAB 2 : Koding dan Pemrograman', 'Mempelajari konsep dasar koding dan hubungannya dengan pemrograman.', 'Koding adalah proses menerjemahkan solusi atau ide manusia ke dalam bahasa yang dapat dipahami komputer. Pemrograman mencakup seluruh proses pengembangan perangkat lunak mulai dari analisis, desain, pengkodean, pengujian hingga pemeliharaan sistem.', 'youtube', 'https://www.youtube.com/watch?v=iA8lLwmtKQM', NULL, NULL, NULL, 'Python', 'print(\"Halo Dunia\")', 'Fungsi print() digunakan untuk menampilkan teks ke layar.', 2, NULL, 'published', 1, 2, '2026-06-23 12:28:03', '2026-06-23 12:28:03'),
(35, 7, 7, 'BAB 3 : Pengenalan Kecerdasan Artifisial', 'Memahami konsep dasar Artificial Intelligence (AI).', 'Kecerdasan Artifisial merupakan cabang ilmu komputer yang memungkinkan mesin meniru kecerdasan manusia dalam menyelesaikan tugas tertentu seperti pengenalan gambar, pengenalan suara, dan pengambilan keputusan.', 'youtube', 'https://www.youtube.com/watch?v=X6Tj2PT41v8', NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, 'published', 1, 3, '2026-06-23 12:35:51', '2026-06-23 12:35:51'),
(36, 7, 7, 'BAB 4 : Berpikir Komputasional', 'Memahami metode penyelesaian masalah secara sistematis.', 'Berpikir komputasional terdiri dari empat pilar utama yaitu dekomposisi, pengenalan pola, abstraksi, dan algoritma.', 'youtube', 'https://www.youtube.com/watch?v=jCb9fpPrxLc', NULL, NULL, NULL, 'Python', 'for i in range(1,6):\r\n    print(i)', 'Contoh sederhana penggunaan algoritma dan perulangan.', 4, NULL, 'published', 1, 4, '2026-06-23 12:37:53', '2026-06-23 12:37:53'),
(37, 7, 7, 'BAB 5 : Literasi Digital', 'Memahami penggunaan teknologi digital secara aman dan bertanggung jawab.', 'Literasi digital mencakup kemampuan mengakses, memahami, mengevaluasi, serta menciptakan informasi menggunakan teknologi digital.', 'youtube', 'https://www.youtube.com/watch?v=ThCcmEbBLc8', NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, 'published', 1, 5, '2026-06-23 12:39:04', '2026-06-23 12:39:04'),
(38, 7, 7, 'BAB 6 : Literasi dan Etika Kecerdasan Artifisial', 'Memahami penggunaan AI secara etis dan bertanggung jawab.', 'Siswa mempelajari konsep Machine Learning, Deep Learning, Generative AI, bias AI, privasi data, transparansi algoritma, dan hak cipta dalam penggunaan AI.', 'youtube', 'https://www.youtube.com/watch?v=v5_gYBtfCKE&pp=ygUoTGl0ZXJhc2kgZGFuIEV0aWthIEtlY2VyZGFzYW4gQXJ0aWZpc2lhbA%3D%3D', NULL, NULL, NULL, NULL, NULL, NULL, 6, NULL, 'published', 1, 6, '2026-06-23 12:42:07', '2026-06-23 12:42:27'),
(39, 7, 7, 'BAB 7 : Pemanfaatan dan Pengembangan Kecerdasan Artifisial', 'Mempelajari berbagai penerapan AI dalam kehidupan sehari-hari serta pengembangan solusi berbasis kecerdasan artifisial.', 'Kecerdasan Artifisial telah digunakan dalam berbagai bidang seperti pendidikan, kesehatan, transportasi, pertanian, dan industri. Teknologi AI mampu membantu manusia dalam menyelesaikan pekerjaan dengan lebih cepat dan akurat.\r\n\r\nContoh pemanfaatan AI yang sering ditemui adalah asisten virtual seperti Google Assistant, sistem rekomendasi pada YouTube dan Netflix, pengenalan wajah pada smartphone, chatbot layanan pelanggan, hingga kendaraan otonom.\r\n\r\nSelain memanfaatkan AI, peserta didik juga dapat belajar mengembangkan solusi sederhana berbasis AI menggunakan berbagai library dan framework yang tersedia. Pengembangan AI dilakukan dengan memanfaatkan data untuk melatih model agar dapat melakukan prediksi atau pengambilan keputusan secara otomatis.', 'youtube', 'https://www.youtube.com/watch?v=phRCCbimydI', NULL, NULL, NULL, NULL, NULL, NULL, 7, NULL, 'published', 1, 7, '2026-06-23 12:46:13', '2026-06-23 12:46:13'),
(40, 7, 7, 'BAB 8 : Algoritma dan Pemrograman', 'Mempelajari cara menyusun langkah-langkah penyelesaian masalah dan mengimplementasikannya ke dalam bahasa pemrograman.', 'Algoritma adalah urutan langkah yang logis dan sistematis untuk menyelesaikan suatu masalah. Dalam dunia komputer, algoritma digunakan sebagai dasar dalam pembuatan program.\r\n\r\nSebelum membuat program, seorang programmer biasanya merancang algoritma terlebih dahulu menggunakan pseudocode atau flowchart. Setelah algoritma selesai dibuat, langkah berikutnya adalah menerjemahkannya ke dalam bahasa pemrograman.\r\n\r\nBahasa pemrograman memungkinkan komputer memahami instruksi yang diberikan manusia. Pada materi ini digunakan bahasa Python karena sintaksnya sederhana dan mudah dipelajari oleh pemula.', 'youtube', 'https://www.youtube.com/watch?v=uqVJc9lLknA', NULL, NULL, NULL, 'Python', 'angka1 = 10\r\nangka2 = 5\r\n\r\nhasil = angka1 + angka2\r\n\r\nprint(\"Hasil =\", hasil)', 'Program menerima dua nilai yang disimpan dalam variabel, kemudian menjumlahkannya dan menampilkan hasil ke layar.', 8, NULL, 'published', 1, 8, '2026-06-23 12:48:57', '2026-06-23 23:51:51'),
(41, 7, 7, 'BAB 9 : Analisis Data', 'Memahami proses pengumpulan, pengolahan, visualisasi, dan analisis data untuk menghasilkan informasi yang berguna.', 'Data merupakan kumpulan fakta yang belum memiliki makna. Setelah diolah, data akan berubah menjadi informasi yang dapat digunakan untuk mendukung pengambilan keputusan.\r\n\r\nAnalisis data membantu seseorang menemukan pola, tren, dan hubungan antar data. Dalam kehidupan sehari-hari, analisis data digunakan untuk memprediksi penjualan, menganalisis prestasi siswa, memantau kondisi kesehatan, hingga membantu pengambilan keputusan bisnis.\r\n\r\nTerdapat beberapa jenis analisis data yaitu analisis deskriptif, diagnostik, prediktif, dan preskriptif. Masing-masing memiliki tujuan yang berbeda dalam mengolah dan memanfaatkan data.', 'youtube', 'https://www.youtube.com/watch?v=mKUJQBGYd1A&t=220s', NULL, NULL, NULL, 'Python', 'data_nilai = [80, 85, 90, 75, 95]\r\n\r\nrata_rata = sum(data_nilai) / len(data_nilai)\r\n\r\nprint(\"Rata-rata nilai =\", rata_rata)', 'Program menghitung rata-rata dari sekumpulan nilai menggunakan fungsi sum() dan len(). Contoh ini merupakan bentuk sederhana analisis data.', 9, NULL, 'published', 1, 9, '2026-06-23 12:50:04', '2026-06-23 12:50:04');

-- --------------------------------------------------------

--
-- Struktur dari tabel `bab_lama`
--

CREATE TABLE `bab_lama` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `materi_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `content` longtext NOT NULL,
  `code_example` longtext DEFAULT NULL,
  `code_language` varchar(255) NOT NULL DEFAULT 'javascript',
  `exercise_title` varchar(255) DEFAULT NULL,
  `exercise_prompt` text DEFAULT NULL,
  `exercise_answer` text DEFAULT NULL,
  `exercise_questions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`exercise_questions`)),
  `quiz_title` varchar(255) DEFAULT NULL,
  `quiz_questions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`quiz_questions`)),
  `order_number` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `bab_lama`
--

INSERT INTO `bab_lama` (`id`, `materi_id`, `title`, `slug`, `description`, `content`, `code_example`, `code_language`, `exercise_title`, `exercise_prompt`, `exercise_answer`, `exercise_questions`, `quiz_title`, `quiz_questions`, `order_number`, `created_at`, `updated_at`) VALUES
(28, 1, 'Pengenalan Variabel', 'js-variabel', 'Memahami cara menyimpan data di dalam variabel.', 'Pada BAB ini siswa mempelajari konsep variabel, aturan penamaan, dan penggunaan let serta const dalam JavaScript.', 'const nama = \'Rina\';\nlet umur = 16;\nconsole.log(nama, umur);', 'javascript', 'Latihan Variabel', 'Tuliskan kata kunci JavaScript yang digunakan untuk membuat variabel yang nilainya bisa diubah.', 'let', '[{\"id\":\"e1\",\"question\":\"Apa keyword untuk membuat variabel yang nilainya bisa diubah?\",\"options\":[{\"key\":\"a\",\"label\":\"const\"},{\"key\":\"b\",\"label\":\"let\"},{\"key\":\"c\",\"label\":\"var()\"},{\"key\":\"d\",\"label\":\"define\"}],\"correct_answer\":\"b\"},{\"id\":\"e2\",\"question\":\"Mana penulisan variabel yang benar di JavaScript?\",\"options\":[{\"key\":\"a\",\"label\":\"let namaSiswa = \\\"Rina\\\";\"},{\"key\":\"b\",\"label\":\"let 1nama = \\\"Rina\\\";\"},{\"key\":\"c\",\"label\":\"variable nama = \\\"Rina\\\";\"},{\"key\":\"d\",\"label\":\"string nama = \\\"Rina\\\";\"}],\"correct_answer\":\"a\"},{\"id\":\"e3\",\"question\":\"Keyword mana yang dipakai untuk variabel bernilai tetap?\",\"options\":[{\"key\":\"a\",\"label\":\"let\"},{\"key\":\"b\",\"label\":\"var\"},{\"key\":\"c\",\"label\":\"const\"},{\"key\":\"d\",\"label\":\"fixed\"}],\"correct_answer\":\"c\"},{\"id\":\"e4\",\"question\":\"Output dari `const nama = \\\"Budi\\\"; console.log(nama);` adalah?\",\"options\":[{\"key\":\"a\",\"label\":\"undefined\"},{\"key\":\"b\",\"label\":\"Budi\"},{\"key\":\"c\",\"label\":\"nama\"},{\"key\":\"d\",\"label\":\"error selalu\"}],\"correct_answer\":\"b\"},{\"id\":\"e5\",\"question\":\"Karakter apa yang tidak boleh di awal nama variabel?\",\"options\":[{\"key\":\"a\",\"label\":\"Huruf\"},{\"key\":\"b\",\"label\":\"Underscore\"},{\"key\":\"c\",\"label\":\"Angka\"},{\"key\":\"d\",\"label\":\"Dollar sign\"}],\"correct_answer\":\"c\"},{\"id\":\"e6\",\"question\":\"Manakah contoh nama variabel yang paling baik?\",\"options\":[{\"key\":\"a\",\"label\":\"x1\"},{\"key\":\"b\",\"label\":\"nama_siswa\"},{\"key\":\"c\",\"label\":\"data\"},{\"key\":\"d\",\"label\":\"abc\"}],\"correct_answer\":\"b\"},{\"id\":\"e7\",\"question\":\"Fungsi utama variabel dalam pemrograman adalah?\",\"options\":[{\"key\":\"a\",\"label\":\"Menghias tampilan\"},{\"key\":\"b\",\"label\":\"Menyimpan data\"},{\"key\":\"c\",\"label\":\"Menghapus file\"},{\"key\":\"d\",\"label\":\"Menjalankan browser\"}],\"correct_answer\":\"b\"},{\"id\":\"e8\",\"question\":\"`let umur = 16;` berarti nilai yang disimpan adalah tipe...\",\"options\":[{\"key\":\"a\",\"label\":\"string\"},{\"key\":\"b\",\"label\":\"boolean\"},{\"key\":\"c\",\"label\":\"number\"},{\"key\":\"d\",\"label\":\"array\"}],\"correct_answer\":\"c\"},{\"id\":\"e9\",\"question\":\"Mana yang termasuk deklarasi variabel?\",\"options\":[{\"key\":\"a\",\"label\":\"console.log(\\\"hai\\\")\"},{\"key\":\"b\",\"label\":\"let kota = \\\"Pekanbaru\\\";\"},{\"key\":\"c\",\"label\":\"if (true) {}\"},{\"key\":\"d\",\"label\":\"return nilai;\"}],\"correct_answer\":\"b\"},{\"id\":\"e10\",\"question\":\"Jika nilai variabel perlu diubah nanti, sebaiknya gunakan...\",\"options\":[{\"key\":\"a\",\"label\":\"const\"},{\"key\":\"b\",\"label\":\"let\"},{\"key\":\"c\",\"label\":\"class\"},{\"key\":\"d\",\"label\":\"import\"}],\"correct_answer\":\"b\"}]', 'Quiz Variabel', '[{\"id\":\"e1\",\"question\":\"Variabel dengan nilai tetap sebaiknya dibuat dengan...\",\"options\":[{\"key\":\"a\",\"label\":\"let\"},{\"key\":\"b\",\"label\":\"const\"},{\"key\":\"c\",\"label\":\"var\"},{\"key\":\"d\",\"label\":\"loop\"}],\"correct_answer\":\"b\"},{\"id\":\"e2\",\"question\":\"Keyword untuk variabel yang bisa berubah adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"static\"},{\"key\":\"b\",\"label\":\"const\"},{\"key\":\"c\",\"label\":\"let\"},{\"key\":\"d\",\"label\":\"return\"}],\"correct_answer\":\"c\"},{\"id\":\"e3\",\"question\":\"Nama variabel yang valid adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"1nilai\"},{\"key\":\"b\",\"label\":\"nilai_siswa\"},{\"key\":\"c\",\"label\":\"nilai siswa\"},{\"key\":\"d\",\"label\":\"class\"}],\"correct_answer\":\"b\"},{\"id\":\"e4\",\"question\":\"Variabel dipakai untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Menyimpan data\"},{\"key\":\"b\",\"label\":\"Menghapus file\"},{\"key\":\"c\",\"label\":\"Mewarnai tombol\"},{\"key\":\"d\",\"label\":\"Membuat route\"}],\"correct_answer\":\"a\"},{\"id\":\"e5\",\"question\":\"Hasil `let x = 5; x = 7;` menunjukkan bahwa...\",\"options\":[{\"key\":\"a\",\"label\":\"let bisa diubah\"},{\"key\":\"b\",\"label\":\"let selalu error\"},{\"key\":\"c\",\"label\":\"x tidak punya nilai\"},{\"key\":\"d\",\"label\":\"7 tidak valid\"}],\"correct_answer\":\"a\"}]', 1, '2026-04-18 03:12:20', '2026-04-18 03:12:20'),
(29, 1, 'Tipe Data dan Operator', 'js-tipe-data-operator', 'Belajar number, string, boolean, dan operator dasar.', 'Siswa belajar membedakan tipe data dasar dan menggunakannya bersama operator aritmatika dan logika.', 'const angka = 10;\nconst teks = \'SMK\';\nconsole.log(angka + 5);\nconsole.log(teks + \' Negeri 5\');', 'javascript', 'Latihan Tipe Data', 'Sebutkan tipe data JavaScript untuk nilai benar atau salah.', 'boolean', '[{\"id\":\"e1\",\"question\":\"Tipe data untuk nilai `true` dan `false` adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"string\"},{\"key\":\"b\",\"label\":\"boolean\"},{\"key\":\"c\",\"label\":\"number\"},{\"key\":\"d\",\"label\":\"object\"}],\"correct_answer\":\"b\"},{\"id\":\"e2\",\"question\":\"Hasil dari `5 + 2` adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"52\"},{\"key\":\"b\",\"label\":\"7\"},{\"key\":\"c\",\"label\":\"3\"},{\"key\":\"d\",\"label\":\"10\"}],\"correct_answer\":\"b\"},{\"id\":\"e3\",\"question\":\"Nilai `\\\"SMK\\\"` termasuk tipe data...\",\"options\":[{\"key\":\"a\",\"label\":\"number\"},{\"key\":\"b\",\"label\":\"boolean\"},{\"key\":\"c\",\"label\":\"string\"},{\"key\":\"d\",\"label\":\"array\"}],\"correct_answer\":\"c\"},{\"id\":\"e4\",\"question\":\"Operator untuk penjumlahan adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"-\"},{\"key\":\"b\",\"label\":\"\\/\"},{\"key\":\"c\",\"label\":\"+\"},{\"key\":\"d\",\"label\":\"==\"}],\"correct_answer\":\"c\"},{\"id\":\"e5\",\"question\":\"Operator untuk membandingkan dua nilai sama adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"=\"},{\"key\":\"b\",\"label\":\"==\"},{\"key\":\"c\",\"label\":\"+=\"},{\"key\":\"d\",\"label\":\"=>\"}],\"correct_answer\":\"b\"},{\"id\":\"e6\",\"question\":\"Hasil `10 > 7` bernilai...\",\"options\":[{\"key\":\"a\",\"label\":\"\\\"true\\\"\"},{\"key\":\"b\",\"label\":\"1\"},{\"key\":\"c\",\"label\":\"true\"},{\"key\":\"d\",\"label\":\"falsey\"}],\"correct_answer\":\"c\"},{\"id\":\"e7\",\"question\":\"`const aktif = false;` berarti `aktif` bertipe...\",\"options\":[{\"key\":\"a\",\"label\":\"boolean\"},{\"key\":\"b\",\"label\":\"string\"},{\"key\":\"c\",\"label\":\"number\"},{\"key\":\"d\",\"label\":\"null\"}],\"correct_answer\":\"a\"},{\"id\":\"e8\",\"question\":\"Operator logika AND di JavaScript adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"||\"},{\"key\":\"b\",\"label\":\"&&\"},{\"key\":\"c\",\"label\":\"??\"},{\"key\":\"d\",\"label\":\"!!\"}],\"correct_answer\":\"b\"},{\"id\":\"e9\",\"question\":\"Tipe data untuk angka bulat dan desimal di JavaScript adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"int\"},{\"key\":\"b\",\"label\":\"float\"},{\"key\":\"c\",\"label\":\"number\"},{\"key\":\"d\",\"label\":\"digit\"}],\"correct_answer\":\"c\"},{\"id\":\"e10\",\"question\":\"Hasil `\\\"5\\\" + 2` di JavaScript menjadi...\",\"options\":[{\"key\":\"a\",\"label\":\"7\"},{\"key\":\"b\",\"label\":\"52\"},{\"key\":\"c\",\"label\":\"error\"},{\"key\":\"d\",\"label\":\"undefined\"}],\"correct_answer\":\"b\"}]', 'Quiz Operator', '[{\"id\":\"e1\",\"question\":\"Tipe data untuk teks adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"number\"},{\"key\":\"b\",\"label\":\"string\"},{\"key\":\"c\",\"label\":\"boolean\"},{\"key\":\"d\",\"label\":\"null\"}],\"correct_answer\":\"b\"},{\"id\":\"e2\",\"question\":\"Hasil `10 - 4` adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"6\"},{\"key\":\"b\",\"label\":\"14\"},{\"key\":\"c\",\"label\":\"104\"},{\"key\":\"d\",\"label\":\"5\"}],\"correct_answer\":\"a\"},{\"id\":\"e3\",\"question\":\"Operator OR di JavaScript adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"&&\"},{\"key\":\"b\",\"label\":\"||\"},{\"key\":\"c\",\"label\":\"==\"},{\"key\":\"d\",\"label\":\"!=\"}],\"correct_answer\":\"b\"},{\"id\":\"e4\",\"question\":\"Nilai `false && true` menghasilkan...\",\"options\":[{\"key\":\"a\",\"label\":\"true\"},{\"key\":\"b\",\"label\":\"false\"},{\"key\":\"c\",\"label\":\"1\"},{\"key\":\"d\",\"label\":\"undefined\"}],\"correct_answer\":\"b\"},{\"id\":\"e5\",\"question\":\"Nilai `\\\"8\\\" + 1` di JavaScript menjadi...\",\"options\":[{\"key\":\"a\",\"label\":\"9\"},{\"key\":\"b\",\"label\":\"81\"},{\"key\":\"c\",\"label\":\"error\"},{\"key\":\"d\",\"label\":\"7\"}],\"correct_answer\":\"b\"}]', 2, '2026-04-18 03:12:20', '2026-04-18 03:12:20'),
(30, 1, 'Percabangan If Else', 'js-percabangan', 'Menentukan alur program berdasarkan kondisi.', 'Materi ini membahas if, else if, dan else untuk membuat keputusan di dalam program.', 'const nilai = 82;\nif (nilai >= 75) {\n  console.log(\'Lulus\');\n} else {\n  console.log(\'Belum lulus\');\n}', 'javascript', 'Latihan Percabangan', 'Tuliskan keyword JavaScript yang dipakai untuk membuat kondisi alternatif ketika syarat utama tidak terpenuhi.', 'else', '[{\"id\":\"e1\",\"question\":\"Keyword utama untuk membuat percabangan adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"for\"},{\"key\":\"b\",\"label\":\"if\"},{\"key\":\"c\",\"label\":\"switcher\"},{\"key\":\"d\",\"label\":\"loop\"}],\"correct_answer\":\"b\"},{\"id\":\"e2\",\"question\":\"Blok kode alternatif saat kondisi salah menggunakan...\",\"options\":[{\"key\":\"a\",\"label\":\"else\"},{\"key\":\"b\",\"label\":\"return\"},{\"key\":\"c\",\"label\":\"break\"},{\"key\":\"d\",\"label\":\"catch\"}],\"correct_answer\":\"a\"},{\"id\":\"e3\",\"question\":\"`else if` dipakai ketika...\",\"options\":[{\"key\":\"a\",\"label\":\"Mengulang kode\"},{\"key\":\"b\",\"label\":\"Menambahkan kondisi lain\"},{\"key\":\"c\",\"label\":\"Menyimpan data\"},{\"key\":\"d\",\"label\":\"Membuat array\"}],\"correct_answer\":\"b\"},{\"id\":\"e4\",\"question\":\"Jika `nilai >= 75`, maka kondisi tersebut disebut...\",\"options\":[{\"key\":\"a\",\"label\":\"ekspresi\"},{\"key\":\"b\",\"label\":\"parameter\"},{\"key\":\"c\",\"label\":\"syarat\"},{\"key\":\"d\",\"label\":\"variabel\"}],\"correct_answer\":\"c\"},{\"id\":\"e5\",\"question\":\"Manakah contoh percabangan yang benar?\",\"options\":[{\"key\":\"a\",\"label\":\"if nilai > 70 {}\"},{\"key\":\"b\",\"label\":\"if (nilai > 70) {}\"},{\"key\":\"c\",\"label\":\"if {nilai > 70}\"},{\"key\":\"d\",\"label\":\"if: nilai > 70\"}],\"correct_answer\":\"b\"},{\"id\":\"e6\",\"question\":\"Tujuan percabangan dalam program adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"Mengatur keputusan\"},{\"key\":\"b\",\"label\":\"Membuat desain\"},{\"key\":\"c\",\"label\":\"Menghapus CSS\"},{\"key\":\"d\",\"label\":\"Mengurutkan file\"}],\"correct_answer\":\"a\"},{\"id\":\"e7\",\"question\":\"`if (umur >= 17)` akan menjalankan blok jika...\",\"options\":[{\"key\":\"a\",\"label\":\"umur kurang dari 17\"},{\"key\":\"b\",\"label\":\"umur sama atau lebih dari 17\"},{\"key\":\"c\",\"label\":\"umur bukan angka\"},{\"key\":\"d\",\"label\":\"selalu dijalankan\"}],\"correct_answer\":\"b\"},{\"id\":\"e8\",\"question\":\"Kondisi di dalam `if (...)` harus menghasilkan...\",\"options\":[{\"key\":\"a\",\"label\":\"string\"},{\"key\":\"b\",\"label\":\"boolean\"},{\"key\":\"c\",\"label\":\"array\"},{\"key\":\"d\",\"label\":\"object\"}],\"correct_answer\":\"b\"},{\"id\":\"e9\",\"question\":\"Keyword mana yang tidak terkait percabangan?\",\"options\":[{\"key\":\"a\",\"label\":\"if\"},{\"key\":\"b\",\"label\":\"else\"},{\"key\":\"c\",\"label\":\"else if\"},{\"key\":\"d\",\"label\":\"while\"}],\"correct_answer\":\"d\"},{\"id\":\"e10\",\"question\":\"Saat semua kondisi tidak terpenuhi, blok yang berjalan adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"if\"},{\"key\":\"b\",\"label\":\"else\"},{\"key\":\"c\",\"label\":\"break\"},{\"key\":\"d\",\"label\":\"continue\"}],\"correct_answer\":\"b\"}]', 'Quiz If Else', '[{\"id\":\"e1\",\"question\":\"Percabangan dipakai untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Mengulang kode\"},{\"key\":\"b\",\"label\":\"Membuat keputusan\"},{\"key\":\"c\",\"label\":\"Mengimpor file\"},{\"key\":\"d\",\"label\":\"Menghapus data\"}],\"correct_answer\":\"b\"},{\"id\":\"e2\",\"question\":\"Blok `else` berjalan ketika...\",\"options\":[{\"key\":\"a\",\"label\":\"Kondisi benar\"},{\"key\":\"b\",\"label\":\"Kondisi salah\"},{\"key\":\"c\",\"label\":\"Loop selesai\"},{\"key\":\"d\",\"label\":\"Array kosong\"}],\"correct_answer\":\"b\"},{\"id\":\"e3\",\"question\":\"`else if` digunakan untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Menambah kondisi lanjutan\"},{\"key\":\"b\",\"label\":\"Menghapus kondisi\"},{\"key\":\"c\",\"label\":\"Membuat function\"},{\"key\":\"d\",\"label\":\"Membuat array\"}],\"correct_answer\":\"a\"},{\"id\":\"e4\",\"question\":\"Kondisi pada `if` harus bernilai...\",\"options\":[{\"key\":\"a\",\"label\":\"boolean\"},{\"key\":\"b\",\"label\":\"array\"},{\"key\":\"c\",\"label\":\"object\"},{\"key\":\"d\",\"label\":\"CSS\"}],\"correct_answer\":\"a\"},{\"id\":\"e5\",\"question\":\"Manakah struktur yang benar?\",\"options\":[{\"key\":\"a\",\"label\":\"if nilai > 70\"},{\"key\":\"b\",\"label\":\"if (nilai > 70) {}\"},{\"key\":\"c\",\"label\":\"if {nilai > 70}\"},{\"key\":\"d\",\"label\":\"if => nilai > 70\"}],\"correct_answer\":\"b\"}]', 3, '2026-04-18 03:12:20', '2026-04-18 03:12:20'),
(31, 1, 'Perulangan Loop', 'js-perulangan', 'Mengulang blok kode dengan efisien.', 'Siswa mengenal for, while, dan cara memilih struktur loop yang tepat.', 'for (let i = 1; i <= 3; i++) {\n  console.log(\'Iterasi ke-\' + i);\n}', 'javascript', 'Latihan Loop', 'Tuliskan keyword JavaScript untuk perulangan yang biasanya dipakai ketika jumlah iterasi sudah diketahui.', 'for', '[{\"id\":\"e1\",\"question\":\"Keyword umum untuk perulangan dengan jumlah iterasi jelas adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"if\"},{\"key\":\"b\",\"label\":\"for\"},{\"key\":\"c\",\"label\":\"const\"},{\"key\":\"d\",\"label\":\"case\"}],\"correct_answer\":\"b\"},{\"id\":\"e2\",\"question\":\"Bagian `i++` pada `for` berfungsi untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Membandingkan nilai\"},{\"key\":\"b\",\"label\":\"Menambah nilai iterasi\"},{\"key\":\"c\",\"label\":\"Menyimpan string\"},{\"key\":\"d\",\"label\":\"Menghentikan program\"}],\"correct_answer\":\"b\"},{\"id\":\"e3\",\"question\":\"Perulangan `while` akan terus berjalan selama...\",\"options\":[{\"key\":\"a\",\"label\":\"kondisi bernilai true\"},{\"key\":\"b\",\"label\":\"browser aktif\"},{\"key\":\"c\",\"label\":\"angka selalu 0\"},{\"key\":\"d\",\"label\":\"ada fungsi\"}],\"correct_answer\":\"a\"},{\"id\":\"e4\",\"question\":\"Output `for (let i=1; i<=3; i++) console.log(i)` adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"1 2 3\"},{\"key\":\"b\",\"label\":\"0 1 2\"},{\"key\":\"c\",\"label\":\"3 2 1\"},{\"key\":\"d\",\"label\":\"1 2 3 4\"}],\"correct_answer\":\"a\"},{\"id\":\"e5\",\"question\":\"Loop digunakan ketika kita ingin...\",\"options\":[{\"key\":\"a\",\"label\":\"Mengulang blok kode\"},{\"key\":\"b\",\"label\":\"Mengganti warna teks\"},{\"key\":\"c\",\"label\":\"Membuat database\"},{\"key\":\"d\",\"label\":\"Menyisipkan gambar\"}],\"correct_answer\":\"a\"},{\"id\":\"e6\",\"question\":\"Mana yang merupakan kondisi pada `for`?\",\"options\":[{\"key\":\"a\",\"label\":\"let i = 0\"},{\"key\":\"b\",\"label\":\"i <= 5\"},{\"key\":\"c\",\"label\":\"i++\"},{\"key\":\"d\",\"label\":\"console.log(i)\"}],\"correct_answer\":\"b\"},{\"id\":\"e7\",\"question\":\"Jika kondisi loop salah sejak awal, maka...\",\"options\":[{\"key\":\"a\",\"label\":\"loop tetap berjalan\"},{\"key\":\"b\",\"label\":\"loop error\"},{\"key\":\"c\",\"label\":\"loop tidak dijalankan\"},{\"key\":\"d\",\"label\":\"browser mati\"}],\"correct_answer\":\"c\"},{\"id\":\"e8\",\"question\":\"Keyword untuk melewati satu iterasi adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"continue\"},{\"key\":\"b\",\"label\":\"return\"},{\"key\":\"c\",\"label\":\"throw\"},{\"key\":\"d\",\"label\":\"yield\"}],\"correct_answer\":\"a\"},{\"id\":\"e9\",\"question\":\"Keyword untuk menghentikan loop lebih cepat adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"stop\"},{\"key\":\"b\",\"label\":\"end\"},{\"key\":\"c\",\"label\":\"break\"},{\"key\":\"d\",\"label\":\"finish\"}],\"correct_answer\":\"c\"},{\"id\":\"e10\",\"question\":\"Perulangan cocok dipakai untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Menampilkan daftar data berulang\"},{\"key\":\"b\",\"label\":\"Membuat password reset\"},{\"key\":\"c\",\"label\":\"Menyalin folder manual\"},{\"key\":\"d\",\"label\":\"Menghapus login\"}],\"correct_answer\":\"a\"}]', 'Quiz Loop', '[{\"id\":\"e1\",\"question\":\"Loop `for` cocok untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Percabangan\"},{\"key\":\"b\",\"label\":\"Iterasi terhitung\"},{\"key\":\"c\",\"label\":\"Styling CSS\"},{\"key\":\"d\",\"label\":\"Upload file\"}],\"correct_answer\":\"b\"},{\"id\":\"e2\",\"question\":\"Keyword untuk menghentikan loop adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"break\"},{\"key\":\"b\",\"label\":\"stop\"},{\"key\":\"c\",\"label\":\"skip\"},{\"key\":\"d\",\"label\":\"pause\"}],\"correct_answer\":\"a\"},{\"id\":\"e3\",\"question\":\"`continue` digunakan untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Keluar dari program\"},{\"key\":\"b\",\"label\":\"Melewati iterasi saat ini\"},{\"key\":\"c\",\"label\":\"Menambah array\"},{\"key\":\"d\",\"label\":\"Menghapus fungsi\"}],\"correct_answer\":\"b\"},{\"id\":\"e4\",\"question\":\"`while` berjalan selama kondisi...\",\"options\":[{\"key\":\"a\",\"label\":\"false\"},{\"key\":\"b\",\"label\":\"true\"},{\"key\":\"c\",\"label\":\"null\"},{\"key\":\"d\",\"label\":\"angka negatif\"}],\"correct_answer\":\"b\"},{\"id\":\"e5\",\"question\":\"Loop berguna untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Mengulang proses\"},{\"key\":\"b\",\"label\":\"Mengganti database\"},{\"key\":\"c\",\"label\":\"Membuat login\"},{\"key\":\"d\",\"label\":\"Menghapus sidebar\"}],\"correct_answer\":\"a\"}]', 4, '2026-04-18 03:12:20', '2026-04-18 03:12:20'),
(32, 1, 'Function dan Array', 'js-function-array', 'Membuat fungsi reusable dan mengelola kumpulan data.', 'Pada tahap ini siswa belajar function dasar, parameter, return value, dan operasi array sederhana.', 'function salam(nama) {\n  return `Halo, ${nama}`;\n}\nconst daftar = [\'Ani\', \'Budi\'];\nconsole.log(salam(daftar[0]));', 'javascript', 'Latihan Function & Array', 'Tuliskan keyword JavaScript untuk mendeklarasikan sebuah fungsi.', 'function', '[{\"id\":\"e1\",\"question\":\"Keyword untuk mendeklarasikan fungsi adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"func\"},{\"key\":\"b\",\"label\":\"method\"},{\"key\":\"c\",\"label\":\"function\"},{\"key\":\"d\",\"label\":\"define\"}],\"correct_answer\":\"c\"},{\"id\":\"e2\",\"question\":\"Parameter pada function digunakan untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Menerima nilai input\"},{\"key\":\"b\",\"label\":\"Menghapus variabel\"},{\"key\":\"c\",\"label\":\"Mewarnai halaman\"},{\"key\":\"d\",\"label\":\"Menutup loop\"}],\"correct_answer\":\"a\"},{\"id\":\"e3\",\"question\":\"`return` pada function berfungsi untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Mengulang fungsi\"},{\"key\":\"b\",\"label\":\"Mengembalikan hasil\"},{\"key\":\"c\",\"label\":\"Menghapus array\"},{\"key\":\"d\",\"label\":\"Menyimpan CSS\"}],\"correct_answer\":\"b\"},{\"id\":\"e4\",\"question\":\"Array digunakan untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Menyimpan banyak data dalam satu variabel\"},{\"key\":\"b\",\"label\":\"Menghapus nilai boolean\"},{\"key\":\"c\",\"label\":\"Mengganti tag HTML\"},{\"key\":\"d\",\"label\":\"Membuat login\"}],\"correct_answer\":\"a\"},{\"id\":\"e5\",\"question\":\"Index pertama pada array adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"1\"},{\"key\":\"b\",\"label\":\"0\"},{\"key\":\"c\",\"label\":\"-1\"},{\"key\":\"d\",\"label\":\"2\"}],\"correct_answer\":\"b\"},{\"id\":\"e6\",\"question\":\"`buah.push(\\\"Mangga\\\")` berfungsi untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Menghapus data\"},{\"key\":\"b\",\"label\":\"Menambah data ke array\"},{\"key\":\"c\",\"label\":\"Mengurutkan array\"},{\"key\":\"d\",\"label\":\"Mencetak array\"}],\"correct_answer\":\"b\"},{\"id\":\"e7\",\"question\":\"Contoh function yang benar adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"function sapa() {}\"},{\"key\":\"b\",\"label\":\"func sapa[]\"},{\"key\":\"c\",\"label\":\"function = sapa\"},{\"key\":\"d\",\"label\":\"def sapa()\"}],\"correct_answer\":\"a\"},{\"id\":\"e8\",\"question\":\"Untuk mengambil data pertama array `daftar`, kita gunakan...\",\"options\":[{\"key\":\"a\",\"label\":\"daftar(0)\"},{\"key\":\"b\",\"label\":\"daftar[1]\"},{\"key\":\"c\",\"label\":\"daftar[0]\"},{\"key\":\"d\",\"label\":\"daftar.first\"}],\"correct_answer\":\"c\"},{\"id\":\"e9\",\"question\":\"Array `[\\\"A\\\", \\\"B\\\", \\\"C\\\"]` memiliki panjang...\",\"options\":[{\"key\":\"a\",\"label\":\"2\"},{\"key\":\"b\",\"label\":\"3\"},{\"key\":\"c\",\"label\":\"4\"},{\"key\":\"d\",\"label\":\"1\"}],\"correct_answer\":\"b\"},{\"id\":\"e10\",\"question\":\"Function membantu kode menjadi...\",\"options\":[{\"key\":\"a\",\"label\":\"Lebih sulit dibaca\"},{\"key\":\"b\",\"label\":\"Repetitif\"},{\"key\":\"c\",\"label\":\"Reusable\"},{\"key\":\"d\",\"label\":\"Tidak bisa dipakai ulang\"}],\"correct_answer\":\"c\"}]', 'Quiz Function & Array', '[{\"id\":\"e1\",\"question\":\"Function dipakai agar kode...\",\"options\":[{\"key\":\"a\",\"label\":\"Lebih berulang manual\"},{\"key\":\"b\",\"label\":\"Bisa digunakan ulang\"},{\"key\":\"c\",\"label\":\"Tidak terbaca\"},{\"key\":\"d\",\"label\":\"Selalu error\"}],\"correct_answer\":\"b\"},{\"id\":\"e2\",\"question\":\"Keyword `return` berguna untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Mengembalikan hasil function\"},{\"key\":\"b\",\"label\":\"Menghapus array\"},{\"key\":\"c\",\"label\":\"Menutup browser\"},{\"key\":\"d\",\"label\":\"Membuat warna\"}],\"correct_answer\":\"a\"},{\"id\":\"e3\",\"question\":\"Array menyimpan...\",\"options\":[{\"key\":\"a\",\"label\":\"Satu nilai saja\"},{\"key\":\"b\",\"label\":\"Banyak nilai dalam satu variabel\"},{\"key\":\"c\",\"label\":\"Hanya angka\"},{\"key\":\"d\",\"label\":\"Hanya teks\"}],\"correct_answer\":\"b\"},{\"id\":\"e4\",\"question\":\"Index pertama array adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"1\"},{\"key\":\"b\",\"label\":\"0\"},{\"key\":\"c\",\"label\":\"2\"},{\"key\":\"d\",\"label\":\"-1\"}],\"correct_answer\":\"b\"},{\"id\":\"e5\",\"question\":\"Method untuk menambah elemen ke akhir array adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"push()\"},{\"key\":\"b\",\"label\":\"pop()\"},{\"key\":\"c\",\"label\":\"shift()\"},{\"key\":\"d\",\"label\":\"slice()\"}],\"correct_answer\":\"a\"}]', 5, '2026-04-18 03:12:20', '2026-04-18 03:12:20'),
(33, 2, 'Struktur HTML', 'html-struktur-dasar', 'Mengenal elemen dasar HTML.', 'Siswa mempelajari tag dasar seperti heading, paragraph, list, link, dan image untuk membentuk struktur halaman.', '<h1>Halo Dunia</h1>\n<p>Belajar HTML dasar.</p>', 'javascript', 'Latihan Struktur HTML', 'Tag HTML apa yang digunakan untuk membuat paragraf?', '<p>', '[{\"id\":\"e1\",\"question\":\"Tag untuk membuat paragraf adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"<h1>\"},{\"key\":\"b\",\"label\":\"<p>\"},{\"key\":\"c\",\"label\":\"<div>\"},{\"key\":\"d\",\"label\":\"<span>\"}],\"correct_answer\":\"b\"},{\"id\":\"e2\",\"question\":\"Tag untuk judul terbesar biasanya adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"<title>\"},{\"key\":\"b\",\"label\":\"<head>\"},{\"key\":\"c\",\"label\":\"<h1>\"},{\"key\":\"d\",\"label\":\"<p>\"}],\"correct_answer\":\"c\"},{\"id\":\"e3\",\"question\":\"Elemen HTML ditulis menggunakan...\",\"options\":[{\"key\":\"a\",\"label\":\"Kurung siku\"},{\"key\":\"b\",\"label\":\"Kurung biasa\"},{\"key\":\"c\",\"label\":\"Tag\"},{\"key\":\"d\",\"label\":\"Petik\"}],\"correct_answer\":\"c\"},{\"id\":\"e4\",\"question\":\"Tag untuk membuat tautan\\/link adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"<a>\"},{\"key\":\"b\",\"label\":\"<img>\"},{\"key\":\"c\",\"label\":\"<ul>\"},{\"key\":\"d\",\"label\":\"<li>\"}],\"correct_answer\":\"a\"},{\"id\":\"e5\",\"question\":\"Atribut untuk alamat tujuan link adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"src\"},{\"key\":\"b\",\"label\":\"class\"},{\"key\":\"c\",\"label\":\"href\"},{\"key\":\"d\",\"label\":\"id\"}],\"correct_answer\":\"c\"},{\"id\":\"e6\",\"question\":\"Tag gambar di HTML adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"<image>\"},{\"key\":\"b\",\"label\":\"<img>\"},{\"key\":\"c\",\"label\":\"<picture>\"},{\"key\":\"d\",\"label\":\"<src>\"}],\"correct_answer\":\"b\"},{\"id\":\"e7\",\"question\":\"Tag daftar tak berurutan adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"<ol>\"},{\"key\":\"b\",\"label\":\"<ul>\"},{\"key\":\"c\",\"label\":\"<dl>\"},{\"key\":\"d\",\"label\":\"<table>\"}],\"correct_answer\":\"b\"},{\"id\":\"e8\",\"question\":\"Tag list item adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"<item>\"},{\"key\":\"b\",\"label\":\"<li>\"},{\"key\":\"c\",\"label\":\"<list>\"},{\"key\":\"d\",\"label\":\"<ul>\"}],\"correct_answer\":\"b\"},{\"id\":\"e9\",\"question\":\"Struktur HTML membantu untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Mengatur susunan konten halaman\"},{\"key\":\"b\",\"label\":\"Menjalankan database\"},{\"key\":\"c\",\"label\":\"Membuat API\"},{\"key\":\"d\",\"label\":\"Menyusun tabel MySQL\"}],\"correct_answer\":\"a\"},{\"id\":\"e10\",\"question\":\"Tag pembungkus umum untuk section halaman adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"<div>\"},{\"key\":\"b\",\"label\":\"<link>\"},{\"key\":\"c\",\"label\":\"<meta>\"},{\"key\":\"d\",\"label\":\"<code>\"}],\"correct_answer\":\"a\"}]', 'Quiz HTML Dasar', '[{\"id\":\"e1\",\"question\":\"Tag untuk heading utama adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"<h1>\"},{\"key\":\"b\",\"label\":\"<p>\"},{\"key\":\"c\",\"label\":\"<div>\"},{\"key\":\"d\",\"label\":\"<title>\"}],\"correct_answer\":\"a\"},{\"id\":\"e2\",\"question\":\"Tag untuk gambar adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"<img>\"},{\"key\":\"b\",\"label\":\"<picturebox>\"},{\"key\":\"c\",\"label\":\"<src>\"},{\"key\":\"d\",\"label\":\"<media>\"}],\"correct_answer\":\"a\"},{\"id\":\"e3\",\"question\":\"Atribut link tujuan memakai...\",\"options\":[{\"key\":\"a\",\"label\":\"src\"},{\"key\":\"b\",\"label\":\"href\"},{\"key\":\"c\",\"label\":\"alt\"},{\"key\":\"d\",\"label\":\"class\"}],\"correct_answer\":\"b\"},{\"id\":\"e4\",\"question\":\"Tag daftar urut adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"<ul>\"},{\"key\":\"b\",\"label\":\"<ol>\"},{\"key\":\"c\",\"label\":\"<dl>\"},{\"key\":\"d\",\"label\":\"<li>\"}],\"correct_answer\":\"b\"},{\"id\":\"e5\",\"question\":\"HTML berfungsi untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Struktur halaman\"},{\"key\":\"b\",\"label\":\"Logika server\"},{\"key\":\"c\",\"label\":\"Query database\"},{\"key\":\"d\",\"label\":\"Enkripsi password\"}],\"correct_answer\":\"a\"}]', 1, '2026-04-18 03:12:20', '2026-04-18 03:12:20'),
(34, 2, 'Form dan Input', 'html-form-input', 'Membuat form interaktif untuk pengguna.', 'BAB ini membahas form, input text, email, password, dan tombol submit.', '<form>\n  <input type=\"text\" placeholder=\"Nama\" />\n  <button>Kirim</button>\n</form>', 'javascript', 'Latihan Form', 'Tag HTML apa yang digunakan untuk membungkus elemen input agar bisa dikirim?', '<form>', '[{\"id\":\"e1\",\"question\":\"Tag pembungkus form adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"<input>\"},{\"key\":\"b\",\"label\":\"<button>\"},{\"key\":\"c\",\"label\":\"<form>\"},{\"key\":\"d\",\"label\":\"<label>\"}],\"correct_answer\":\"c\"},{\"id\":\"e2\",\"question\":\"Tag untuk kotak input teks adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"<text>\"},{\"key\":\"b\",\"label\":\"<input>\"},{\"key\":\"c\",\"label\":\"<textarea>\"},{\"key\":\"d\",\"label\":\"<field>\"}],\"correct_answer\":\"b\"},{\"id\":\"e3\",\"question\":\"Atribut `type=\\\"password\\\"` digunakan untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Email\"},{\"key\":\"b\",\"label\":\"Nomor\"},{\"key\":\"c\",\"label\":\"Password tersembunyi\"},{\"key\":\"d\",\"label\":\"Tanggal\"}],\"correct_answer\":\"c\"},{\"id\":\"e4\",\"question\":\"Tombol kirim form biasa menggunakan...\",\"options\":[{\"key\":\"a\",\"label\":\"<submit>\"},{\"key\":\"b\",\"label\":\"<button type=\\\"submit\\\">\"},{\"key\":\"c\",\"label\":\"<send>\"},{\"key\":\"d\",\"label\":\"<input type=\\\"button\\\">\"}],\"correct_answer\":\"b\"},{\"id\":\"e5\",\"question\":\"Tag untuk area input teks panjang adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"<input>\"},{\"key\":\"b\",\"label\":\"<textarea>\"},{\"key\":\"c\",\"label\":\"<select>\"},{\"key\":\"d\",\"label\":\"<option>\"}],\"correct_answer\":\"b\"},{\"id\":\"e6\",\"question\":\"Label pada form berguna untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Menjelaskan input\"},{\"key\":\"b\",\"label\":\"Menyimpan data\"},{\"key\":\"c\",\"label\":\"Menghapus tombol\"},{\"key\":\"d\",\"label\":\"Mengunci halaman\"}],\"correct_answer\":\"a\"},{\"id\":\"e7\",\"question\":\"Dropdown pada form dibuat dengan tag...\",\"options\":[{\"key\":\"a\",\"label\":\"<menu>\"},{\"key\":\"b\",\"label\":\"<list>\"},{\"key\":\"c\",\"label\":\"<select>\"},{\"key\":\"d\",\"label\":\"<choice>\"}],\"correct_answer\":\"c\"},{\"id\":\"e8\",\"question\":\"Pilihan di dalam dropdown memakai tag...\",\"options\":[{\"key\":\"a\",\"label\":\"<item>\"},{\"key\":\"b\",\"label\":\"<option>\"},{\"key\":\"c\",\"label\":\"<select-item>\"},{\"key\":\"d\",\"label\":\"<input>\"}],\"correct_answer\":\"b\"},{\"id\":\"e9\",\"question\":\"Atribut `placeholder` berfungsi untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Memberi warna\"},{\"key\":\"b\",\"label\":\"Menampilkan petunjuk singkat\"},{\"key\":\"c\",\"label\":\"Mengirim form\"},{\"key\":\"d\",\"label\":\"Membuat input wajib\"}],\"correct_answer\":\"b\"},{\"id\":\"e10\",\"question\":\"Form interaktif digunakan untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Mengambil input dari pengguna\"},{\"key\":\"b\",\"label\":\"Menambah database otomatis\"},{\"key\":\"c\",\"label\":\"Menghapus CSS\"},{\"key\":\"d\",\"label\":\"Menutup browser\"}],\"correct_answer\":\"a\"}]', 'Quiz Form HTML', '[{\"id\":\"e1\",\"question\":\"Tag input teks adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"<input>\"},{\"key\":\"b\",\"label\":\"<field>\"},{\"key\":\"c\",\"label\":\"<type>\"},{\"key\":\"d\",\"label\":\"<text>\"}],\"correct_answer\":\"a\"},{\"id\":\"e2\",\"question\":\"Atribut `type=\\\\\\\"email\\\\\\\"` dipakai untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Nomor\"},{\"key\":\"b\",\"label\":\"Password\"},{\"key\":\"c\",\"label\":\"Email\"},{\"key\":\"d\",\"label\":\"Tanggal\"}],\"correct_answer\":\"c\"},{\"id\":\"e3\",\"question\":\"Tombol kirim form biasanya memakai...\",\"options\":[{\"key\":\"a\",\"label\":\"type=\\\\\\\"button\\\\\\\"\"},{\"key\":\"b\",\"label\":\"type=\\\\\\\"submit\\\\\\\"\"},{\"key\":\"c\",\"label\":\"type=\\\\\\\"link\\\\\\\"\"},{\"key\":\"d\",\"label\":\"type=\\\\\\\"send\\\\\\\"\"}],\"correct_answer\":\"b\"},{\"id\":\"e4\",\"question\":\"Dropdown dibuat dengan...\",\"options\":[{\"key\":\"a\",\"label\":\"<select>\"},{\"key\":\"b\",\"label\":\"<optionbox>\"},{\"key\":\"c\",\"label\":\"<menu>\"},{\"key\":\"d\",\"label\":\"<dropdown>\"}],\"correct_answer\":\"a\"},{\"id\":\"e5\",\"question\":\"Form dipakai untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Input pengguna\"},{\"key\":\"b\",\"label\":\"Styling halaman\"},{\"key\":\"c\",\"label\":\"Routing\"},{\"key\":\"d\",\"label\":\"Migrasi database\"}],\"correct_answer\":\"a\"}]', 2, '2026-04-18 03:12:20', '2026-04-18 03:12:20'),
(35, 2, 'CSS Selector dan Warna', 'css-selector-warna', 'Memberi tampilan visual pada elemen HTML.', 'Siswa mengenal selector, warna, background, dan font untuk mempercantik halaman.', 'body {\n  background: #f7f7f6;\n  color: #1e293b;\n}', 'javascript', 'Latihan CSS Dasar', 'Property CSS apa yang digunakan untuk mengubah warna teks?', 'color', '[{\"id\":\"e1\",\"question\":\"Property CSS untuk warna teks adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"background\"},{\"key\":\"b\",\"label\":\"font-color\"},{\"key\":\"c\",\"label\":\"color\"},{\"key\":\"d\",\"label\":\"text-style\"}],\"correct_answer\":\"c\"},{\"id\":\"e2\",\"question\":\"Property untuk warna latar belakang adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"background\"},{\"key\":\"b\",\"label\":\"fill\"},{\"key\":\"c\",\"label\":\"color-bg\"},{\"key\":\"d\",\"label\":\"border\"}],\"correct_answer\":\"a\"},{\"id\":\"e3\",\"question\":\"CSS digunakan untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Menyusun logika program\"},{\"key\":\"b\",\"label\":\"Mengatur tampilan elemen\"},{\"key\":\"c\",\"label\":\"Menyimpan data\"},{\"key\":\"d\",\"label\":\"Membuat route\"}],\"correct_answer\":\"b\"},{\"id\":\"e4\",\"question\":\"Selector untuk elemen body adalah...\",\"options\":[{\"key\":\"a\",\"label\":\".body\"},{\"key\":\"b\",\"label\":\"#body\"},{\"key\":\"c\",\"label\":\"body\"},{\"key\":\"d\",\"label\":\"*body\"}],\"correct_answer\":\"c\"},{\"id\":\"e5\",\"question\":\"Tanda `#` pada CSS biasa dipakai untuk memilih...\",\"options\":[{\"key\":\"a\",\"label\":\"class\"},{\"key\":\"b\",\"label\":\"tag\"},{\"key\":\"c\",\"label\":\"id\"},{\"key\":\"d\",\"label\":\"semua elemen\"}],\"correct_answer\":\"c\"},{\"id\":\"e6\",\"question\":\"Tanda `.` pada CSS dipakai untuk memilih...\",\"options\":[{\"key\":\"a\",\"label\":\"class\"},{\"key\":\"b\",\"label\":\"id\"},{\"key\":\"c\",\"label\":\"body\"},{\"key\":\"d\",\"label\":\"table\"}],\"correct_answer\":\"a\"},{\"id\":\"e7\",\"question\":\"Property untuk ukuran huruf adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"font-size\"},{\"key\":\"b\",\"label\":\"text-weight\"},{\"key\":\"c\",\"label\":\"size-text\"},{\"key\":\"d\",\"label\":\"font-scale\"}],\"correct_answer\":\"a\"},{\"id\":\"e8\",\"question\":\"Property untuk ketebalan huruf adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"font-width\"},{\"key\":\"b\",\"label\":\"font-weight\"},{\"key\":\"c\",\"label\":\"text-bold\"},{\"key\":\"d\",\"label\":\"weight\"}],\"correct_answer\":\"b\"},{\"id\":\"e9\",\"question\":\"Nilai warna hex biasanya diawali dengan...\",\"options\":[{\"key\":\"a\",\"label\":\"&\"},{\"key\":\"b\",\"label\":\"$\"},{\"key\":\"c\",\"label\":\"#\"},{\"key\":\"d\",\"label\":\"@\"}],\"correct_answer\":\"c\"},{\"id\":\"e10\",\"question\":\"CSS membantu halaman menjadi...\",\"options\":[{\"key\":\"a\",\"label\":\"Lebih rapi dan menarik\"},{\"key\":\"b\",\"label\":\"Lebih lambat selalu\"},{\"key\":\"c\",\"label\":\"Tidak punya warna\"},{\"key\":\"d\",\"label\":\"Tidak bisa dibaca\"}],\"correct_answer\":\"a\"}]', 'Quiz Selector CSS', '[{\"id\":\"e1\",\"question\":\"Selector class diawali dengan...\",\"options\":[{\"key\":\"a\",\"label\":\"#\"},{\"key\":\"b\",\"label\":\".\"},{\"key\":\"c\",\"label\":\"@\"},{\"key\":\"d\",\"label\":\"&\"}],\"correct_answer\":\"b\"},{\"id\":\"e2\",\"question\":\"Selector id diawali dengan...\",\"options\":[{\"key\":\"a\",\"label\":\".\"},{\"key\":\"b\",\"label\":\"#\"},{\"key\":\"c\",\"label\":\"$\"},{\"key\":\"d\",\"label\":\":\"}],\"correct_answer\":\"b\"},{\"id\":\"e3\",\"question\":\"Property untuk ukuran font adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"font-size\"},{\"key\":\"b\",\"label\":\"text-size\"},{\"key\":\"c\",\"label\":\"size\"},{\"key\":\"d\",\"label\":\"font-style\"}],\"correct_answer\":\"a\"},{\"id\":\"e4\",\"question\":\"Property untuk background adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"bg-color\"},{\"key\":\"b\",\"label\":\"background\"},{\"key\":\"c\",\"label\":\"fill\"},{\"key\":\"d\",\"label\":\"paint\"}],\"correct_answer\":\"b\"},{\"id\":\"e5\",\"question\":\"CSS dipakai untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Mengatur tampilan\"},{\"key\":\"b\",\"label\":\"Menyimpan data\"},{\"key\":\"c\",\"label\":\"Membuat route\"},{\"key\":\"d\",\"label\":\"Menghitung nilai\"}],\"correct_answer\":\"a\"}]', 3, '2026-04-18 03:12:20', '2026-04-18 03:12:20'),
(36, 2, 'Layout Flexbox', 'css-flexbox', 'Menyusun layout responsif dengan flexbox.', 'Materi ini mengajarkan display flex, justify-content, align-items, dan gap.', '.container {\n  display: flex;\n  justify-content: space-between;\n  gap: 16px;\n}', 'javascript', 'Latihan Flexbox', 'Nilai property display apa yang digunakan untuk mengaktifkan flexbox?', 'flex', '[{\"id\":\"e1\",\"question\":\"Untuk mengaktifkan flexbox, gunakan `display: ...`\",\"options\":[{\"key\":\"a\",\"label\":\"block\"},{\"key\":\"b\",\"label\":\"grid\"},{\"key\":\"c\",\"label\":\"flex\"},{\"key\":\"d\",\"label\":\"inline\"}],\"correct_answer\":\"c\"},{\"id\":\"e2\",\"question\":\"Property untuk mengatur posisi horizontal item adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"align-items\"},{\"key\":\"b\",\"label\":\"justify-content\"},{\"key\":\"c\",\"label\":\"flex-wrap\"},{\"key\":\"d\",\"label\":\"gap\"}],\"correct_answer\":\"b\"},{\"id\":\"e3\",\"question\":\"Property untuk mengatur posisi vertikal item adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"justify-content\"},{\"key\":\"b\",\"label\":\"align-items\"},{\"key\":\"c\",\"label\":\"display\"},{\"key\":\"d\",\"label\":\"padding\"}],\"correct_answer\":\"b\"},{\"id\":\"e4\",\"question\":\"Property untuk memberi jarak antar item flex adalah...\",\"options\":[{\"key\":\"a\",\"label\":\"gap\"},{\"key\":\"b\",\"label\":\"space\"},{\"key\":\"c\",\"label\":\"margin-auto\"},{\"key\":\"d\",\"label\":\"distance\"}],\"correct_answer\":\"a\"},{\"id\":\"e5\",\"question\":\"Flexbox cocok untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Layout satu dimensi\"},{\"key\":\"b\",\"label\":\"Query database\"},{\"key\":\"c\",\"label\":\"Membuat login\"},{\"key\":\"d\",\"label\":\"Menjalankan PHP\"}],\"correct_answer\":\"a\"},{\"id\":\"e6\",\"question\":\"Nilai `space-between` biasanya dipakai pada...\",\"options\":[{\"key\":\"a\",\"label\":\"display\"},{\"key\":\"b\",\"label\":\"justify-content\"},{\"key\":\"c\",\"label\":\"align-items\"},{\"key\":\"d\",\"label\":\"position\"}],\"correct_answer\":\"b\"},{\"id\":\"e7\",\"question\":\"Jika item ingin turun ke baris berikutnya, gunakan...\",\"options\":[{\"key\":\"a\",\"label\":\"flex-wrap\"},{\"key\":\"b\",\"label\":\"align-content\"},{\"key\":\"c\",\"label\":\"overflow\"},{\"key\":\"d\",\"label\":\"wrap-item\"}],\"correct_answer\":\"a\"},{\"id\":\"e8\",\"question\":\"Container flex ditulis pada elemen...\",\"options\":[{\"key\":\"a\",\"label\":\"Induk\"},{\"key\":\"b\",\"label\":\"Anak terakhir\"},{\"key\":\"c\",\"label\":\"Input\"},{\"key\":\"d\",\"label\":\"Script\"}],\"correct_answer\":\"a\"},{\"id\":\"e9\",\"question\":\"Property `flex-direction: column` membuat item...\",\"options\":[{\"key\":\"a\",\"label\":\"Berjejer ke samping\"},{\"key\":\"b\",\"label\":\"Berjejer ke bawah\"},{\"key\":\"c\",\"label\":\"Menghilang\"},{\"key\":\"d\",\"label\":\"Membesar otomatis\"}],\"correct_answer\":\"b\"},{\"id\":\"e10\",\"question\":\"Flexbox membantu membuat layout...\",\"options\":[{\"key\":\"a\",\"label\":\"Responsif dan rapi\"},{\"key\":\"b\",\"label\":\"Tidak teratur\"},{\"key\":\"c\",\"label\":\"Hanya hitam putih\"},{\"key\":\"d\",\"label\":\"Tanpa struktur\"}],\"correct_answer\":\"a\"}]', 'Quiz Flexbox', '[{\"id\":\"e1\",\"question\":\"Untuk mengatur arah item flex digunakan...\",\"options\":[{\"key\":\"a\",\"label\":\"flex-direction\"},{\"key\":\"b\",\"label\":\"justify-content\"},{\"key\":\"c\",\"label\":\"gap\"},{\"key\":\"d\",\"label\":\"wrap\"}],\"correct_answer\":\"a\"},{\"id\":\"e2\",\"question\":\"`justify-content: center` membuat item...\",\"options\":[{\"key\":\"a\",\"label\":\"Rata kiri\"},{\"key\":\"b\",\"label\":\"Di tengah horizontal\"},{\"key\":\"c\",\"label\":\"Di bawah\"},{\"key\":\"d\",\"label\":\"Mengecil\"}],\"correct_answer\":\"b\"},{\"id\":\"e3\",\"question\":\"`align-items: center` mengatur...\",\"options\":[{\"key\":\"a\",\"label\":\"Posisi vertikal item\"},{\"key\":\"b\",\"label\":\"Warna item\"},{\"key\":\"c\",\"label\":\"Lebar item\"},{\"key\":\"d\",\"label\":\"Urutan item\"}],\"correct_answer\":\"a\"},{\"id\":\"e4\",\"question\":\"`gap` dipakai untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Jarak antar item\"},{\"key\":\"b\",\"label\":\"Menghapus item\"},{\"key\":\"c\",\"label\":\"Mengganti warna\"},{\"key\":\"d\",\"label\":\"Membuat border\"}],\"correct_answer\":\"a\"},{\"id\":\"e5\",\"question\":\"Flexbox sangat cocok untuk...\",\"options\":[{\"key\":\"a\",\"label\":\"Layout komponen responsif\"},{\"key\":\"b\",\"label\":\"Menghapus database\"},{\"key\":\"c\",\"label\":\"Membuat login API\"},{\"key\":\"d\",\"label\":\"Menyusun migration\"}],\"correct_answer\":\"a\"}]', 4, '2026-04-18 03:12:20', '2026-04-18 03:12:20');

-- --------------------------------------------------------

--
-- Struktur dari tabel `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `hasil_latihan_akhir`
--

CREATE TABLE `hasil_latihan_akhir` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `exercise_id` bigint(20) UNSIGNED NOT NULL,
  `score` int(10) UNSIGNED NOT NULL,
  `total_correct` int(10) UNSIGNED NOT NULL,
  `total_questions` int(10) UNSIGNED NOT NULL,
  `duration_used_minutes` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `status` enum('passed','failed') NOT NULL,
  `submit_method` varchar(255) NOT NULL DEFAULT 'manual',
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `jawaban_pengumpulan_latihan`
--

CREATE TABLE `jawaban_pengumpulan_latihan` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `submission_id` bigint(20) UNSIGNED NOT NULL,
  `question_id` bigint(20) UNSIGNED NOT NULL,
  `answer_text` text DEFAULT NULL,
  `selected_option` varchar(255) DEFAULT NULL,
  `is_correct` tinyint(1) DEFAULT NULL,
  `score_awarded` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `jawaban_pengumpulan_siswa`
--

CREATE TABLE `jawaban_pengumpulan_siswa` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_submission_id` bigint(20) UNSIGNED NOT NULL,
  `question_source` varchar(255) DEFAULT NULL,
  `question_id` bigint(20) UNSIGNED DEFAULT NULL,
  `question_text` text NOT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options`)),
  `selected_answer` varchar(255) DEFAULT NULL,
  `correct_answer` varchar(255) DEFAULT NULL,
  `is_correct` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `jawaban_riwayat_latihan`
--

CREATE TABLE `jawaban_riwayat_latihan` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `exercise_attempt_id` bigint(20) UNSIGNED NOT NULL,
  `exercise_question_id` bigint(20) UNSIGNED NOT NULL,
  `selected_answer` enum('A','B','C','D') DEFAULT NULL,
  `is_correct` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `kuis`
--

CREATE TABLE `kuis` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `material_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `duration_minutes` int(10) UNSIGNED NOT NULL DEFAULT 30,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `latihan`
--

CREATE TABLE `latihan` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `chapter_id` bigint(20) UNSIGNED DEFAULT NULL,
  `material_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `type` enum('chapter','final_exam') NOT NULL DEFAULT 'chapter',
  `total_questions` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `duration_minutes` int(10) UNSIGNED DEFAULT NULL,
  `status` enum('draft','active','inactive') NOT NULL DEFAULT 'draft',
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `question` varchar(255) DEFAULT NULL,
  `option_a` varchar(255) DEFAULT NULL,
  `option_b` varchar(255) DEFAULT NULL,
  `option_c` varchar(255) DEFAULT NULL,
  `option_d` varchar(255) DEFAULT NULL,
  `correct_answer` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `latihan`
--

INSERT INTO `latihan` (`id`, `chapter_id`, `material_id`, `title`, `description`, `type`, `total_questions`, `duration_minutes`, `status`, `created_by`, `question`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `created_at`, `updated_at`) VALUES
(22, NULL, NULL, 'Latihan Materi 1', NULL, 'final_exam', 4, 30, 'active', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-10 03:13:36', '2026-06-10 03:13:36'),
(23, NULL, NULL, 'Latihan Akhir 2', NULL, 'final_exam', 4, 30, 'active', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-10 03:36:28', '2026-06-10 03:36:28'),
(24, 33, NULL, 'Latihan Pengantar Mapel Koding dan Kecerdasan Artifisial', NULL, 'chapter', 3, NULL, 'active', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-23 23:00:49', '2026-06-23 23:00:49'),
(26, 34, NULL, 'Latihan Koding dan Pemrograman', NULL, 'chapter', 3, NULL, 'active', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-23 23:06:03', '2026-06-23 23:09:38'),
(27, 35, NULL, 'Latihan Pengenalan Kecerdasan Artifisial', NULL, 'chapter', 3, NULL, 'active', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-23 23:29:27', '2026-06-23 23:29:27'),
(28, 36, NULL, 'Latihan Berpikir Komputasional', NULL, 'chapter', 3, NULL, 'active', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-23 23:42:46', '2026-06-23 23:42:46'),
(29, 37, NULL, 'Latihan Literasi Digital', NULL, 'chapter', 3, NULL, 'active', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-23 23:46:20', '2026-06-23 23:46:20'),
(30, 38, NULL, 'Latihan Literasi dan Etika Kecerdasan Artifisial', NULL, 'chapter', 3, NULL, 'active', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-23 23:48:55', '2026-06-23 23:48:55'),
(31, 39, NULL, 'Latihan Pemanfaatan dan Pengembangan Kecerdasan Artifisial', NULL, 'chapter', 3, NULL, 'active', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-23 23:51:30', '2026-06-23 23:51:30'),
(32, 40, NULL, 'Latihan Algoritma dan Pemrograman', NULL, 'chapter', 3, NULL, 'active', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-23 23:53:58', '2026-06-23 23:53:58'),
(33, 41, NULL, 'Latihan Bab Analisi Data', NULL, 'chapter', 3, NULL, 'active', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-23 23:55:41', '2026-06-23 23:55:41'),
(34, NULL, 7, 'Latihan Akhir Mata Pelajaran Koding dan Kecerdasan Artifisial', NULL, 'final_exam', 10, 30, 'active', 1, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-24 00:03:28', '2026-06-24 00:03:28');

-- --------------------------------------------------------

--
-- Struktur dari tabel `materi`
--

CREATE TABLE `materi` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `status` enum('draft','publish') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `materi`
--

INSERT INTO `materi` (`id`, `title`, `description`, `thumbnail`, `status`, `created_at`, `updated_at`) VALUES
(7, 'Materi 1 : Mata Pelajaran Koding dan Kecerdasan Artifisial pada Kurikulum Nasional', 'Materi ini memperkenalkan mata pelajaran Koding dan Kecerdasan Artifisial (KKA), mencakup konsep dasar koding, kecerdasan artifisial, berpikir komputasional, literasi digital, etika AI, algoritma pemrograman, dan analisis data sebagai bekal peserta didik menghadapi era transformasi digital.', NULL, 'publish', '2026-06-23 12:24:36', '2026-06-23 12:24:36');

-- --------------------------------------------------------

--
-- Struktur dari tabel `materi_lama`
--

CREATE TABLE `materi_lama` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `estimated_duration` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `materi_lama`
--

INSERT INTO `materi_lama` (`id`, `title`, `slug`, `description`, `estimated_duration`, `created_at`, `updated_at`) VALUES
(1, 'JavaScript Dasar', 'javascript-dasar', 'Materi dasar JavaScript untuk memahami variabel, percabangan, perulangan, function, dan array.', '5 BAB', '2026-04-18 02:11:52', '2026-04-18 02:11:52'),
(2, 'HTML dan CSS Dasar', 'html-css-dasar', 'Belajar struktur halaman web dan styling dasar untuk membangun antarmuka yang rapi.', '4 BAB', '2026-04-18 02:11:52', '2026-04-18 02:11:52');

-- --------------------------------------------------------

--
-- Struktur dari tabel `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_04_16_000001_add_role_and_nisn_to_users_table', 1),
(5, '2026_04_16_000002_add_nip_to_users_table', 2),
(6, '2026_04_18_000001_create_materi_table', 3),
(7, '2026_04_18_000002_create_bab_table', 3),
(8, '2026_04_18_000003_create_progress_table', 3),
(9, '2026_04_18_000004_add_exercise_fields_to_bab_table', 4),
(10, '2026_04_18_000005_add_exercise_progress_fields_to_progress_table', 4),
(11, '2026_04_18_000006_add_exercise_questions_to_bab_table', 5),
(12, '2026_04_18_000007_add_quiz_questions_to_bab_table', 6),
(13, '2026_04_18_000008_create_materials_table', 7),
(14, '2026_04_18_000009_create_chapters_table', 7),
(15, '2026_04_18_000010_create_exercises_table', 7),
(16, '2026_04_18_000011_create_quizzes_table', 7),
(17, '2026_04_18_000012_create_quiz_questions_table', 7),
(18, '2026_04_22_000001_create_student_learning_progress_tables', 8),
(19, '2026_04_22_000002_create_student_submission_tables', 9),
(20, '2026_05_05_000001_align_learning_platform_schema', 10),
(21, '2026_05_05_000002_add_student_profile_columns_to_users_table', 11),
(22, '2026_05_06_000001_add_teacher_profile_columns_to_users_table', 12),
(23, '2026_06_06_000001_add_material_thumbnail_and_chapter_video_url', 13),
(24, '2026_06_06_000002_add_materi_id_alias_to_chapters_table', 14),
(25, '2026_06_06_000003_add_video_type_and_video_file_to_chapters_table', 15),
(26, '2026_06_07_000001_create_exercise_attempt_tables', 16),
(27, '2026_06_07_000002_add_timer_fields_to_exercise_attempts_and_final_results', 17),
(28, '2026_06_07_000003_add_material_id_to_exercises_table', 18),
(29, '2026_06_07_000004_migrate_final_exams_to_material_relation', 19),
(30, '2026_06_08_000001_rename_tables_to_indonesian_names', 19),
(31, '2026_06_08_000002_rename_remaining_learning_tables_to_indonesian_names', 20),
(32, '2026_06_08_000003_add_contoh_kode_fields_to_bab_table', 21);

-- --------------------------------------------------------

--
-- Struktur dari tabel `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengguna`
--

CREATE TABLE `pengguna` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `nisn` varchar(255) DEFAULT NULL,
  `nip` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('siswa','guru') NOT NULL DEFAULT 'siswa',
  `class_name` varchar(255) DEFAULT NULL,
  `major` varchar(255) DEFAULT NULL,
  `school_name` varchar(255) DEFAULT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `pengguna`
--

INSERT INTO `pengguna` (`id`, `name`, `email`, `phone`, `nisn`, `nip`, `subject`, `email_verified_at`, `password`, `role`, `class_name`, `major`, `school_name`, `profile_photo`, `status`, `last_login_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Adri Daswin, S. Pd', 'guru@gmail.com', NULL, NULL, '1987654321', 'TKJ', NULL, '$2y$12$wJcpEZZzsIfxVoXhW1ESzOyQKeVwpEbPxrWGrgG8jOCsrTSyT29aq', 'guru', NULL, NULL, 'SMKN 5 PEKANBARU', NULL, 'active', '2026-06-25 05:45:50', NULL, '2026-04-16 01:08:20', '2026-06-25 05:45:50');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengumpulan_latihan`
--

CREATE TABLE `pengumpulan_latihan` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `exercise_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('submitted','pending_review','graded') NOT NULL DEFAULT 'pending_review',
  `score` int(10) UNSIGNED DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `graded_by` bigint(20) UNSIGNED DEFAULT NULL,
  `graded_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengumpulan_siswa`
--

CREATE TABLE `pengumpulan_siswa` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `material_id` bigint(20) UNSIGNED DEFAULT NULL,
  `chapter_id` bigint(20) UNSIGNED DEFAULT NULL,
  `quiz_id` bigint(20) UNSIGNED DEFAULT NULL,
  `type` enum('exercise','quiz') NOT NULL,
  `title` varchar(255) NOT NULL,
  `score` int(10) UNSIGNED DEFAULT NULL,
  `teacher_score` int(10) UNSIGNED DEFAULT NULL,
  `teacher_feedback` text DEFAULT NULL,
  `teacher_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` enum('pending','graded') NOT NULL DEFAULT 'pending',
  `submitted_at` timestamp NULL DEFAULT NULL,
  `graded_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `progress_bab`
--

CREATE TABLE `progress_bab` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `chapter_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('not_started','in_progress','completed') NOT NULL DEFAULT 'not_started',
  `progress_percentage` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `progress_bab_siswa`
--

CREATE TABLE `progress_bab_siswa` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `chapter_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('locked','unlocked','completed') NOT NULL DEFAULT 'locked',
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `progress_kuis_siswa`
--

CREATE TABLE `progress_kuis_siswa` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `quiz_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('locked','unlocked','completed') NOT NULL DEFAULT 'locked',
  `score` int(10) UNSIGNED DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `progress_lama`
--

CREATE TABLE `progress_lama` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `bab_id` bigint(20) UNSIGNED NOT NULL,
  `is_completed` tinyint(1) NOT NULL DEFAULT 0,
  `exercise_attempts` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `exercise_last_score` tinyint(3) UNSIGNED DEFAULT NULL,
  `exercise_completed_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `progress_latihan_siswa`
--

CREATE TABLE `progress_latihan_siswa` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `exercise_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('locked','unlocked','completed') NOT NULL DEFAULT 'locked',
  `score` int(10) UNSIGNED DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `progress_materi_siswa`
--

CREATE TABLE `progress_materi_siswa` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `material_id` bigint(20) UNSIGNED NOT NULL,
  `current_chapter_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_completed` tinyint(1) NOT NULL DEFAULT 0,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `riwayat_latihan`
--

CREATE TABLE `riwayat_latihan` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `exercise_id` bigint(20) UNSIGNED NOT NULL,
  `total_questions` int(11) NOT NULL DEFAULT 0,
  `correct_answers` int(11) NOT NULL DEFAULT 0,
  `wrong_answers` int(11) NOT NULL DEFAULT 0,
  `score` decimal(5,2) NOT NULL DEFAULT 0.00,
  `started_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `submit_method` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('4oW8Lh4GDoCBrirFOiTWx4Caaqu9enWsJlS0VpOz', 2, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoibUpnMExwOGNvdVFvMlhsbVFRMFNkRFp3TUVBY05VUm5tTm9HckJXZCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zaXN3YS9kYXNoYm9hcmQiO3M6NToicm91dGUiO3M6MTU6InNpc3dhLmRhc2hib2FyZCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjI7fQ==', 1782381739),
('gkG2XagNzvAgrXcDuEEIuHQeq2o0PjAoQ15itUVZ', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiY0RFSHdkTW5TaG80a1NpNklKb2s5S3AxeDMyMHdGYWdvMzQ0YWFsbCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9ndXJ1L3Byb2ZpbCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTt9', 1782382020),
('iZnAszIAIZUE1ZXBA6fUHcyaZMT7fNbr2tmXDaMs', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiVEVONzU5TmZYQWxXNUZFOXo5ZnlNc3dpYXJkZlRBTkpHWkk4U2g4ZyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9ndXJ1L2tlbG9sYS1zaXN3YSI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTt9', 1782395605),
('PvKtcBivJnXcBhm6OP7pdj3qUjtCFMxyMAmAN0PJ', 2, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiNnFDWkdEUWRURFhQMUVpMzFFdW91TTlhVzdQYzg1Z2ptSnRMV3VEWiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zaXN3YS9kYXNoYm9hcmQiO3M6NToicm91dGUiO3M6MTU6InNpc3dhLmRhc2hib2FyZCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjI7fQ==', 1782393764),
('tFISsHsKFX5y5Ao0cnywLGAcvLVe2Vv3QT1kODi3', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.126.0 Chrome/148.0.7778.97 Electron/42.2.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRnRrNDdWNG4xZWVjVEdqcmdabEN5eUY5MTJlaG9tUEpqRzdZYVNYUyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9sb2dpbiI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1782381587);

-- --------------------------------------------------------

--
-- Struktur dari tabel `soal_kuis`
--

CREATE TABLE `soal_kuis` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `quiz_id` bigint(20) UNSIGNED NOT NULL,
  `question` text NOT NULL,
  `option_a` varchar(255) NOT NULL,
  `option_b` varchar(255) NOT NULL,
  `option_c` varchar(255) NOT NULL,
  `option_d` varchar(255) NOT NULL,
  `correct_answer` enum('A','B','C','D') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `soal_latihan`
--

CREATE TABLE `soal_latihan` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `exercise_id` bigint(20) UNSIGNED NOT NULL,
  `question_text` text NOT NULL,
  `question_type` enum('multiple_choice','essay') NOT NULL DEFAULT 'multiple_choice',
  `option_a` varchar(255) DEFAULT NULL,
  `option_b` varchar(255) DEFAULT NULL,
  `option_c` varchar(255) DEFAULT NULL,
  `option_d` varchar(255) DEFAULT NULL,
  `correct_answer` varchar(255) DEFAULT NULL,
  `score` int(10) UNSIGNED NOT NULL DEFAULT 10,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `soal_latihan`
--

INSERT INTO `soal_latihan` (`id`, `exercise_id`, `question_text`, `question_type`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `score`, `created_at`, `updated_at`) VALUES
(31, 22, 'Apa tujuan utama dari koding dalam pengembangan teknologi?', 'multiple_choice', 'A. Menghias tampilan komputer', 'B. Memberikan instruksi kepada komputer agar dapat menjalankan tugas tertentu', 'C. Mempercepat koneksi internet', 'D. Menyimpan file pada perangkat', 'B', 1, '2026-06-10 03:13:36', '2026-06-10 03:13:36'),
(32, 22, 'Perhatikan langkah-langkah berikut:\n\nMenentukan masalah\nMenyusun algoritma\nMenulis kode program\nMenguji program\n\nUrutan yang benar dalam proses pembuatan program adalah...', 'multiple_choice', 'A. 1 → 2 → 3 → 4', 'B. 2 → 1 → 3 → 4', 'C. 1 → 3 → 2 → 4', 'D. 3 → 1 → 2 → 4', 'A', 1, '2026-06-10 03:13:36', '2026-06-10 03:13:36'),
(33, 22, 'print(\"Halo Dunia\")\n\nOutput dari program tersebut adalah...', 'multiple_choice', 'A. Halo Python', 'B. Halo Dunia', 'C. Error', 'D. Dunia Halo', 'B', 1, '2026-06-10 03:13:36', '2026-06-10 03:13:36'),
(34, 22, 'Manakah yang termasuk contoh penerapan koding dalam kehidupan sehari-hari?', 'multiple_choice', 'A. Aplikasi pemesanan makanan online', 'B. Menulis catatan di buku tulis', 'C. Menggambar di kertas kosong', 'D. Membaca koran cetak', 'A', 1, '2026-06-10 03:13:36', '2026-06-10 03:13:36'),
(39, 23, 'Apa yang dimaksud dengan Pemrograman Kecerdasan Artifisial?', 'multiple_choice', 'A. Proses memperbaiki perangkat keras komputer', 'B. Proses membuat sistem komputer yang dapat melakukan tugas yang membutuhkan kecerdasan manusia', 'C. Proses menghubungkan komputer ke internet', 'D. Proses membuat desain grafis', 'B', 1, '2026-06-10 03:46:59', '2026-06-10 03:46:59'),
(40, 23, 'Bahasa pemrograman yang paling banyak digunakan dalam pengembangan Artificial Intelligence adalah...', 'multiple_choice', 'A. HTML', 'B. CSS', 'C. Python', 'D. SQL', 'C', 1, '2026-06-10 03:46:59', '2026-06-10 03:46:59'),
(41, 23, 'data = [90, 85, 88, 92]\nprint(data)\n\nkode diatas digunakan untuk..', 'multiple_choice', 'A. Menampilkan kumpulan data ke layar', 'B. Membuat website', 'C. Menghapus data', 'D. Menghubungkan ke database', 'A', 1, '2026-06-10 03:46:59', '2026-06-10 03:46:59'),
(42, 23, 'from sklearn.linear_model import LinearRegression\n\ntujuan kode diatas adalah...', 'multiple_choice', 'A. Menampilkan teks ke layar', 'B. Mengimpor library untuk membuat model Machine Learning Linear Regression', 'C. Menghapus data pada program', 'D. Membuat database baru', 'B', 1, '2026-06-10 03:46:59', '2026-06-10 03:46:59'),
(43, 24, 'Mengapa pembelajaran Koding dan Kecerdasan Artifisial penting bagi peserta didik?', 'multiple_choice', 'A. Untuk menggantikan semua mata pelajaran', 'B. Untuk meningkatkan kemampuan olahraga', 'C. Untuk membekali peserta didik menghadapi era digital', 'D. Untuk mengurangi penggunaan teknologi', 'C', 1, '2026-06-23 23:00:49', '2026-06-23 23:00:49'),
(44, 24, 'Salah satu teknologi yang berkembang pada era Revolusi Industri 4.0 adalah ...', 'multiple_choice', 'A. Mesin ketik', 'B. Kecerdasan Artifisial', 'C. Televisi analog', 'D. Radio', 'B', 1, '2026-06-23 23:00:49', '2026-06-23 23:00:49'),
(45, 24, 'Program Koding dan KA mendukung pembangunan ...', 'multiple_choice', 'A. Ekonomi digital', 'B. Pertanian tradisional', 'C. Perdagangan barter', 'D. Sistem manual', 'A', 1, '2026-06-23 23:00:49', '2026-06-23 23:00:49'),
(60, 27, 'Kecerdasan Artifisial adalah bidang ilmu yang berusaha membuat komputer ...', 'multiple_choice', 'A. Menjadi lebih berat', 'B. Meniru kecerdasan manusia', 'C. Menjadi lebih mahal', 'D. Menjadi lebih besar', 'B', 1, '2026-06-23 23:37:07', '2026-06-23 23:37:07'),
(61, 27, 'Perhatikan kode berikut:\n\nprint(\"Artificial Intelligence\")\n\nTujuan program tersebut adalah ...', 'multiple_choice', 'A. Menampilkan teks ke layar', 'B. Menghapus data', 'C. Membuat AI', 'D. Menyimpan file', 'A', 1, '2026-06-23 23:37:07', '2026-06-23 23:37:07'),
(62, 27, 'Contoh penerapan AI adalah ...', 'multiple_choice', 'A. Kalkulator manual', 'B. Mesin tik', 'C. Sistem rekomendasi film', 'D. Penggaris', 'C', 1, '2026-06-23 23:37:07', '2026-06-23 23:37:07'),
(63, 26, 'Koding adalah proses ...', 'multiple_choice', 'A. Membeli komputer', 'B. Mengubah ide menjadi instruksi yang dipahami komputer', 'C. Memperbaiki perangkat keras', 'D. Menghapus data', 'B', 1, '2026-06-23 23:39:29', '2026-06-23 23:39:29'),
(64, 26, 'Pemrograman mencakup ...', 'multiple_choice', 'A. Koding saja', 'B. Mengetik kode', 'C. Seluruh proses pengembangan perangkat lunak', 'D. Bermain aplikasi', 'C', 1, '2026-06-23 23:39:29', '2026-06-23 23:39:29'),
(65, 26, 'Perhatikan kode berikut:\n\nprint(\"Halo Dunia\")\n\nOutput yang dihasilkan adalah ...', 'multiple_choice', 'A. Halo Dunia', 'B. print', 'C. Error', 'D. Halo', 'A', 1, '2026-06-23 23:39:29', '2026-06-23 23:39:29'),
(66, 28, 'Proses memecah masalah besar menjadi bagian kecil disebut ...', 'multiple_choice', 'A. Algoritma', 'B. Dekomposisi', 'C. Simulasi', 'D. Digitalisasi', 'B', 1, '2026-06-23 23:42:46', '2026-06-23 23:42:46'),
(67, 28, 'Perhatikan kode berikut:\nfor i in range(1,4):\n    print(i)\nOutput yang dihasilkan adalah ...', 'multiple_choice', '1 2 3', '0 1 2', '1 2 3 4', '4 3 2 1', 'A', 1, '2026-06-23 23:42:46', '2026-06-23 23:42:46'),
(68, 28, 'Pengenalan pola dalam berpikir komputasional bertujuan untuk ...', 'multiple_choice', 'A. Menemukan kesamaan pada masalah yang dihadapi', 'B. Menghapus data', 'C. Membuat gambar', 'D. Menginstal aplikasi', 'A', 1, '2026-06-23 23:42:46', '2026-06-23 23:42:46'),
(69, 29, 'Literasi digital adalah kemampuan untuk ...', 'multiple_choice', 'A. Menggunakan teknologi secara bijak dan bertanggung jawab', 'B. Bermain game sepanjang hari', 'C. Menghindari internet', 'D. Mengganti komputer', 'A', 1, '2026-06-23 23:46:20', '2026-06-23 23:46:20'),
(70, 29, 'Salah satu ancaman keamanan digital adalah ...', 'multiple_choice', 'A. Hoaks', 'B. Buku digital', 'C. Keyboard', 'D. Printer', 'A', 1, '2026-06-23 23:46:20', '2026-06-23 23:46:20'),
(71, 29, 'Saat menerima informasi dari media sosial, tindakan yang tepat adalah ...', 'multiple_choice', 'A. Langsung menyebarkan', 'B. Memverifikasi kebenarannya terlebih dahulu', 'C. Mengabaikannya', 'D. Menghapus akun', 'B', 1, '2026-06-23 23:46:20', '2026-06-23 23:46:20'),
(72, 30, 'Machine Learning merupakan bagian dari ...', 'multiple_choice', 'A. Artificial Intelligence', 'B. Basis Data', 'C. Sistem Operasi', 'D. Jaringan Komputer', 'A', 1, '2026-06-23 23:48:55', '2026-06-23 23:48:55'),
(73, 30, 'Generative AI dapat digunakan untuk ...', 'multiple_choice', 'A. Membuat teks dan gambar', 'B. Menambah RAM', 'C. Menghapus internet', 'D. Memperbesar monitor', 'A', 1, '2026-06-23 23:48:55', '2026-06-23 23:48:55'),
(74, 30, 'Perhatikan kode berikut:\nfrom sklearn.linear_model import LinearRegression\n\nmodel = LinearRegression()\nKode tersebut digunakan untuk ...', 'multiple_choice', 'A. Membuat model Machine Learning sederhana', 'B. Membuat website', 'C. Menghapus data', 'D. Menampilkan gambar', 'A', 1, '2026-06-23 23:48:55', '2026-06-23 23:48:55'),
(75, 31, 'Contoh penerapan AI dalam kehidupan sehari-hari adalah ...', 'multiple_choice', 'A. Google Assistant', 'B. Penggaris', 'C. Pensil', 'D. Buku', 'A', 1, '2026-06-23 23:51:30', '2026-06-23 23:51:30'),
(76, 31, 'Teknologi pengenalan wajah pada smartphone memanfaatkan ...', 'multiple_choice', 'A. Artificial Intelligence', 'B. Mesin ketik', 'C. Harddisk', 'D. Flashdisk', 'A', 1, '2026-06-23 23:51:30', '2026-06-23 23:51:30'),
(77, 31, 'Perhatikan kode berikut:\nchatbot = \"Halo, ada yang bisa saya bantu?\"\nprint(chatbot)\nProgram tersebut mensimulasikan ...', 'multiple_choice', 'A. Chatbot sederhana', 'B. Game', 'C. Browser', 'D. Database', 'A', 1, '2026-06-23 23:51:30', '2026-06-23 23:51:30'),
(78, 32, 'Algoritma adalah ...', 'multiple_choice', 'A. Urutan langkah logis untuk menyelesaikan masalah', 'B. Perangkat keras', 'C. Bahasa Inggris', 'D. Data', 'A', 1, '2026-06-23 23:53:58', '2026-06-23 23:53:58'),
(79, 32, 'Perhatikan kode berikut:\nangka1 = 10\nangka2 = 5\n\nhasil = angka1 + angka2\n\nprint(hasil)\nOutput program adalah ...', 'multiple_choice', 'A. 5', 'B. 10', 'C. 15', 'D. 20', 'C', 1, '2026-06-23 23:53:58', '2026-06-23 23:53:58'),
(80, 32, 'Flowchart digunakan untuk ...', 'multiple_choice', 'A. Menggambarkan alur penyelesaian masalah secara visual', 'B. Menyimpan data', 'C. Menggambar foto', 'D. Menghapus program', 'A', 1, '2026-06-23 23:53:58', '2026-06-23 23:53:58'),
(81, 33, 'Data yang telah diolah sehingga memiliki makna disebut ...', 'multiple_choice', 'A. Informasi', 'B. File', 'C. Folder', 'D. Dokumen', 'A', 1, '2026-06-23 23:55:41', '2026-06-23 23:55:41'),
(82, 33, 'Perhatikan kode berikut:\ndata = [80, 85, 90]\n\nrata_rata = sum(data) / len(data)\n\nprint(rata_rata)\nOutput program adalah ...', 'multiple_choice', 'A. 80', 'B. 85', 'C. 90', 'D. 255', 'B', 1, '2026-06-23 23:55:41', '2026-06-23 23:55:41'),
(83, 33, 'Analisis yang digunakan untuk memprediksi kejadian di masa depan disebut ...', 'multiple_choice', 'A. Deskriptif', 'B. Diagnostik', 'C. Prediktif', 'D. Preskriptif', 'C', 1, '2026-06-23 23:55:41', '2026-06-23 23:55:41'),
(84, 34, 'Tujuan utama pembelajaran Koding dan Kecerdasan Artifisial adalah ...', 'multiple_choice', 'A. Menggantikan pekerjaan manusia', 'B. Mengembangkan kemampuan berpikir komputasional dan literasi digital', 'C. Mengurangi penggunaan teknologi', 'D. Membatasi akses internet', 'B', 1, '2026-06-24 00:03:28', '2026-06-24 00:03:28'),
(85, 34, 'Perhatikan kode berikut:\nprint(\"Halo Dunia\")\nOutput yang dihasilkan adalah ...', 'multiple_choice', 'A. Halo', 'B. Dunia', 'C. Halo Dunia', 'D. Error', 'C', 1, '2026-06-24 00:03:28', '2026-06-24 00:03:28'),
(86, 34, 'Berikut yang termasuk empat pilar berpikir komputasional adalah ...', 'multiple_choice', 'A. Dekomposisi, Pengenalan Pola, Abstraksi, Algoritma', 'B. Data, Informasi, AI, Program', 'C. Input, Output, Proses, Jaringan', 'D. Variabel, Operator, Fungsi, List', 'A', 1, '2026-06-24 00:03:28', '2026-06-24 00:03:28'),
(87, 34, 'Contoh penerapan Kecerdasan Artifisial dalam kehidupan sehari-hari adalah ...', 'multiple_choice', 'A. Penggaris', 'B. Buku tulis', 'C. Google Assistant', 'D. Kalkulator manual', 'C', 1, '2026-06-24 00:03:28', '2026-06-24 00:03:28'),
(88, 34, 'Perhatikan kode berikut:\n\nangka1 = 10\nangka2 = 5\n\nprint(angka1 + angka2)\n\nOutput program tersebut adalah ...', 'multiple_choice', 'A. 5', 'B. 10', 'C. 15', 'D. 20', 'C', 1, '2026-06-24 00:03:28', '2026-06-24 00:03:28'),
(89, 34, 'Salah satu prinsip etika dalam penggunaan AI adalah ...', 'multiple_choice', 'A. Menyebarkan data pribadi', 'B. Keadilan dan transparansi', 'C. Menyalin karya orang lain', 'D. Mengabaikan privasi pengguna', 'B', 1, '2026-06-24 00:03:28', '2026-06-24 00:03:28'),
(90, 34, 'Perhatikan kode berikut:\n\nfor i in range(1,4):\n    print(i)\n\nOutput yang dihasilkan adalah ...', 'multiple_choice', 'A. 1 2 3', 'B. 3 4 5', 'C. 0 1 2', 'D. 0 2 4', 'A', 1, '2026-06-24 00:03:28', '2026-06-24 00:03:28'),
(91, 34, 'Data yang telah diolah sehingga memiliki makna disebut ...', 'multiple_choice', 'A. Folder', 'B. Dokumen', 'C. Informasi', 'D. Arsip', 'C', 1, '2026-06-24 00:03:28', '2026-06-24 00:03:28'),
(92, 34, 'Perhatikan kode berikut:\n\ndata = [80, 85, 90]\n\nrata_rata = sum(data) / len(data)\n\nprint(rata_rata)\n\nOutput program tersebut adalah ...', 'multiple_choice', 'A. 20', 'B. 85', 'C. 100', 'D. 225', 'A', 1, '2026-06-24 00:03:28', '2026-06-24 00:03:28'),
(93, 34, 'Machine Learning merupakan bagian dari ...', 'multiple_choice', 'A. Sistem Operasi', 'B. Jaringan Komputer', 'C. Basis Data', 'D. Kecerdasan Artifisial', 'D', 1, '2026-06-24 00:03:28', '2026-06-24 00:03:28');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `bab`
--
ALTER TABLE `bab`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chapters_material_id_foreign` (`material_id`),
  ADD KEY `chapters_created_by_foreign` (`created_by`),
  ADD KEY `chapters_materi_id_foreign` (`materi_id`);

--
-- Indeks untuk tabel `bab_lama`
--
ALTER TABLE `bab_lama`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bab_materi_id_order_number_unique` (`materi_id`,`order_number`),
  ADD UNIQUE KEY `bab_slug_unique` (`slug`);

--
-- Indeks untuk tabel `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indeks untuk tabel `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indeks untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indeks untuk tabel `hasil_latihan_akhir`
--
ALTER TABLE `hasil_latihan_akhir`
  ADD PRIMARY KEY (`id`),
  ADD KEY `final_exam_results_user_id_foreign` (`user_id`),
  ADD KEY `final_exam_results_exercise_id_foreign` (`exercise_id`);

--
-- Indeks untuk tabel `jawaban_pengumpulan_latihan`
--
ALTER TABLE `jawaban_pengumpulan_latihan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `submission_answers_submission_id_foreign` (`submission_id`),
  ADD KEY `submission_answers_question_id_foreign` (`question_id`);

--
-- Indeks untuk tabel `jawaban_pengumpulan_siswa`
--
ALTER TABLE `jawaban_pengumpulan_siswa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_submission_answers_student_submission_id_foreign` (`student_submission_id`);

--
-- Indeks untuk tabel `jawaban_riwayat_latihan`
--
ALTER TABLE `jawaban_riwayat_latihan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exercise_attempt_answers_exercise_attempt_id_foreign` (`exercise_attempt_id`),
  ADD KEY `exercise_attempt_answers_exercise_question_id_foreign` (`exercise_question_id`);

--
-- Indeks untuk tabel `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indeks untuk tabel `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `kuis`
--
ALTER TABLE `kuis`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `quizzes_material_id_unique` (`material_id`);

--
-- Indeks untuk tabel `latihan`
--
ALTER TABLE `latihan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exercises_chapter_id_foreign` (`chapter_id`),
  ADD KEY `exercises_created_by_foreign` (`created_by`),
  ADD KEY `exercises_material_id_foreign` (`material_id`);

--
-- Indeks untuk tabel `materi`
--
ALTER TABLE `materi`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `materi_lama`
--
ALTER TABLE `materi_lama`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `materi_slug_unique` (`slug`);

--
-- Indeks untuk tabel `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indeks untuk tabel `pengguna`
--
ALTER TABLE `pengguna`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_nisn_unique` (`nisn`),
  ADD UNIQUE KEY `users_nip_unique` (`nip`);

--
-- Indeks untuk tabel `pengumpulan_latihan`
--
ALTER TABLE `pengumpulan_latihan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `submissions_user_id_foreign` (`user_id`),
  ADD KEY `submissions_exercise_id_foreign` (`exercise_id`),
  ADD KEY `submissions_graded_by_foreign` (`graded_by`);

--
-- Indeks untuk tabel `pengumpulan_siswa`
--
ALTER TABLE `pengumpulan_siswa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_submissions_student_id_foreign` (`student_id`),
  ADD KEY `student_submissions_material_id_foreign` (`material_id`),
  ADD KEY `student_submissions_chapter_id_foreign` (`chapter_id`),
  ADD KEY `student_submissions_quiz_id_foreign` (`quiz_id`),
  ADD KEY `student_submissions_teacher_id_foreign` (`teacher_id`);

--
-- Indeks untuk tabel `progress_bab`
--
ALTER TABLE `progress_bab`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `chapter_progress_user_id_chapter_id_unique` (`user_id`,`chapter_id`),
  ADD KEY `chapter_progress_chapter_id_foreign` (`chapter_id`);

--
-- Indeks untuk tabel `progress_bab_siswa`
--
ALTER TABLE `progress_bab_siswa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_chapter_progress_student_id_chapter_id_unique` (`student_id`,`chapter_id`),
  ADD KEY `student_chapter_progress_chapter_id_foreign` (`chapter_id`);

--
-- Indeks untuk tabel `progress_kuis_siswa`
--
ALTER TABLE `progress_kuis_siswa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_quiz_progress_student_id_quiz_id_unique` (`student_id`,`quiz_id`),
  ADD KEY `student_quiz_progress_quiz_id_foreign` (`quiz_id`);

--
-- Indeks untuk tabel `progress_lama`
--
ALTER TABLE `progress_lama`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `progress_user_id_bab_id_unique` (`user_id`,`bab_id`),
  ADD KEY `progress_bab_id_foreign` (`bab_id`);

--
-- Indeks untuk tabel `progress_latihan_siswa`
--
ALTER TABLE `progress_latihan_siswa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_exercise_progress_student_id_exercise_id_unique` (`student_id`,`exercise_id`),
  ADD KEY `student_exercise_progress_exercise_id_foreign` (`exercise_id`);

--
-- Indeks untuk tabel `progress_materi_siswa`
--
ALTER TABLE `progress_materi_siswa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_material_progress_student_id_material_id_unique` (`student_id`,`material_id`),
  ADD KEY `student_material_progress_material_id_foreign` (`material_id`),
  ADD KEY `student_material_progress_current_chapter_id_foreign` (`current_chapter_id`);

--
-- Indeks untuk tabel `riwayat_latihan`
--
ALTER TABLE `riwayat_latihan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exercise_attempts_user_id_foreign` (`user_id`),
  ADD KEY `exercise_attempts_exercise_id_foreign` (`exercise_id`);

--
-- Indeks untuk tabel `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indeks untuk tabel `soal_kuis`
--
ALTER TABLE `soal_kuis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quiz_questions_quiz_id_foreign` (`quiz_id`);

--
-- Indeks untuk tabel `soal_latihan`
--
ALTER TABLE `soal_latihan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `questions_exercise_id_foreign` (`exercise_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `bab`
--
ALTER TABLE `bab`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT untuk tabel `bab_lama`
--
ALTER TABLE `bab_lama`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `hasil_latihan_akhir`
--
ALTER TABLE `hasil_latihan_akhir`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `jawaban_pengumpulan_latihan`
--
ALTER TABLE `jawaban_pengumpulan_latihan`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT untuk tabel `jawaban_pengumpulan_siswa`
--
ALTER TABLE `jawaban_pengumpulan_siswa`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `jawaban_riwayat_latihan`
--
ALTER TABLE `jawaban_riwayat_latihan`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=140;

--
-- AUTO_INCREMENT untuk tabel `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `kuis`
--
ALTER TABLE `kuis`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `latihan`
--
ALTER TABLE `latihan`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT untuk tabel `materi`
--
ALTER TABLE `materi`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `materi_lama`
--
ALTER TABLE `materi_lama`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT untuk tabel `pengguna`
--
ALTER TABLE `pengguna`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `pengumpulan_latihan`
--
ALTER TABLE `pengumpulan_latihan`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `pengumpulan_siswa`
--
ALTER TABLE `pengumpulan_siswa`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `progress_bab`
--
ALTER TABLE `progress_bab`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT untuk tabel `progress_bab_siswa`
--
ALTER TABLE `progress_bab_siswa`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `progress_kuis_siswa`
--
ALTER TABLE `progress_kuis_siswa`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `progress_lama`
--
ALTER TABLE `progress_lama`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `progress_latihan_siswa`
--
ALTER TABLE `progress_latihan_siswa`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `progress_materi_siswa`
--
ALTER TABLE `progress_materi_siswa`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `riwayat_latihan`
--
ALTER TABLE `riwayat_latihan`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT untuk tabel `soal_kuis`
--
ALTER TABLE `soal_kuis`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `soal_latihan`
--
ALTER TABLE `soal_latihan`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `bab`
--
ALTER TABLE `bab`
  ADD CONSTRAINT `chapters_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `pengguna` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `chapters_materi_id_foreign` FOREIGN KEY (`materi_id`) REFERENCES `materi` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chapters_material_id_foreign` FOREIGN KEY (`material_id`) REFERENCES `materi` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `bab_lama`
--
ALTER TABLE `bab_lama`
  ADD CONSTRAINT `bab_materi_id_foreign` FOREIGN KEY (`materi_id`) REFERENCES `materi_lama` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `hasil_latihan_akhir`
--
ALTER TABLE `hasil_latihan_akhir`
  ADD CONSTRAINT `final_exam_results_exercise_id_foreign` FOREIGN KEY (`exercise_id`) REFERENCES `latihan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `final_exam_results_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `jawaban_pengumpulan_latihan`
--
ALTER TABLE `jawaban_pengumpulan_latihan`
  ADD CONSTRAINT `submission_answers_question_id_foreign` FOREIGN KEY (`question_id`) REFERENCES `soal_latihan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `submission_answers_submission_id_foreign` FOREIGN KEY (`submission_id`) REFERENCES `pengumpulan_latihan` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `jawaban_pengumpulan_siswa`
--
ALTER TABLE `jawaban_pengumpulan_siswa`
  ADD CONSTRAINT `student_submission_answers_student_submission_id_foreign` FOREIGN KEY (`student_submission_id`) REFERENCES `pengumpulan_siswa` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `jawaban_riwayat_latihan`
--
ALTER TABLE `jawaban_riwayat_latihan`
  ADD CONSTRAINT `exercise_attempt_answers_exercise_attempt_id_foreign` FOREIGN KEY (`exercise_attempt_id`) REFERENCES `riwayat_latihan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `exercise_attempt_answers_exercise_question_id_foreign` FOREIGN KEY (`exercise_question_id`) REFERENCES `soal_latihan` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `kuis`
--
ALTER TABLE `kuis`
  ADD CONSTRAINT `quizzes_material_id_foreign` FOREIGN KEY (`material_id`) REFERENCES `materi` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `latihan`
--
ALTER TABLE `latihan`
  ADD CONSTRAINT `exercises_chapter_id_foreign` FOREIGN KEY (`chapter_id`) REFERENCES `bab` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `exercises_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `pengguna` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `exercises_material_id_foreign` FOREIGN KEY (`material_id`) REFERENCES `materi` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `pengumpulan_latihan`
--
ALTER TABLE `pengumpulan_latihan`
  ADD CONSTRAINT `submissions_exercise_id_foreign` FOREIGN KEY (`exercise_id`) REFERENCES `latihan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `submissions_graded_by_foreign` FOREIGN KEY (`graded_by`) REFERENCES `pengguna` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `submissions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `pengumpulan_siswa`
--
ALTER TABLE `pengumpulan_siswa`
  ADD CONSTRAINT `student_submissions_chapter_id_foreign` FOREIGN KEY (`chapter_id`) REFERENCES `bab` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `student_submissions_material_id_foreign` FOREIGN KEY (`material_id`) REFERENCES `materi` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `student_submissions_quiz_id_foreign` FOREIGN KEY (`quiz_id`) REFERENCES `kuis` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `student_submissions_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_submissions_teacher_id_foreign` FOREIGN KEY (`teacher_id`) REFERENCES `pengguna` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `progress_bab`
--
ALTER TABLE `progress_bab`
  ADD CONSTRAINT `chapter_progress_chapter_id_foreign` FOREIGN KEY (`chapter_id`) REFERENCES `bab` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chapter_progress_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `progress_bab_siswa`
--
ALTER TABLE `progress_bab_siswa`
  ADD CONSTRAINT `student_chapter_progress_chapter_id_foreign` FOREIGN KEY (`chapter_id`) REFERENCES `bab` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_chapter_progress_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `progress_kuis_siswa`
--
ALTER TABLE `progress_kuis_siswa`
  ADD CONSTRAINT `student_quiz_progress_quiz_id_foreign` FOREIGN KEY (`quiz_id`) REFERENCES `kuis` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_quiz_progress_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `progress_lama`
--
ALTER TABLE `progress_lama`
  ADD CONSTRAINT `progress_bab_id_foreign` FOREIGN KEY (`bab_id`) REFERENCES `bab_lama` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `progress_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `progress_latihan_siswa`
--
ALTER TABLE `progress_latihan_siswa`
  ADD CONSTRAINT `student_exercise_progress_exercise_id_foreign` FOREIGN KEY (`exercise_id`) REFERENCES `latihan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_exercise_progress_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `progress_materi_siswa`
--
ALTER TABLE `progress_materi_siswa`
  ADD CONSTRAINT `student_material_progress_current_chapter_id_foreign` FOREIGN KEY (`current_chapter_id`) REFERENCES `bab` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `student_material_progress_material_id_foreign` FOREIGN KEY (`material_id`) REFERENCES `materi` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_material_progress_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `riwayat_latihan`
--
ALTER TABLE `riwayat_latihan`
  ADD CONSTRAINT `exercise_attempts_exercise_id_foreign` FOREIGN KEY (`exercise_id`) REFERENCES `latihan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `exercise_attempts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `soal_kuis`
--
ALTER TABLE `soal_kuis`
  ADD CONSTRAINT `quiz_questions_quiz_id_foreign` FOREIGN KEY (`quiz_id`) REFERENCES `kuis` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `soal_latihan`
--
ALTER TABLE `soal_latihan`
  ADD CONSTRAINT `questions_exercise_id_foreign` FOREIGN KEY (`exercise_id`) REFERENCES `latihan` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
