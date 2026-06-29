import { Navigate, Route, Routes } from 'react-router-dom';
import TeacherLayout from './layouts/LayoutGuru';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import HalamanDaftar from './pages/auth/HalamanDaftar';
import HalamanLogin from './pages/auth/HalamanLogin';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardGuru from './pages/DashboardGuru';
import KelolaLatihanGuru from './pages/KelolaLatihanGuru';
import ProfilGuru from './pages/ProfilGuru';
import KelolaBabGuru from './pages/KelolaBabGuru';
import KelolaKuisGuru from './pages/KelolaKuisGuru';
import KelolaMateriGuru from './pages/guru/KelolaMateriGuru';
import KelolaSiswa from './pages/guru/KelolaSiswa';
import StatistikSiswaGuru from './pages/guru/StatistikSiswaGuru';
import DashboardSiswa from './pages/siswa/DashboardSiswa';
import DetailMateriSiswa from './pages/siswa/DetailMateriSiswa';
import HasilLatihanAkhirSiswa from './pages/siswa/HasilLatihanAkhirSiswa';
import HasilLatihanBabSiswa from './pages/siswa/HasilLatihanBabSiswa';
import LatihanAkhirSiswa from './pages/siswa/LatihanAkhirSiswa';
import LatihanBabSiswa from './pages/siswa/LatihanBabSiswa';
import MateriSiswa from './pages/siswa/MateriSiswa';
import NilaiSiswa from './pages/siswa/NilaiSiswa';
import PengerjaanLatihanAkhirSiswa from './pages/siswa/PengerjaanLatihanAkhirSiswa';
import PengerjaanLatihanBabSiswa from './pages/siswa/PengerjaanLatihanBabSiswa';
import ProfilSiswa from './pages/siswa/ProfilSiswa';
import BabSiswa from './pages/siswa/BabSiswa';
import LatihanSiswa from './pages/siswa/LatihanSiswa';
import KuisSiswa from './pages/siswa/KuisSiswa';

function teacherPage(page) {
    return <TeacherLayout>{page}</TeacherLayout>;
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<HalamanLogin />} />
            <Route path="/register" element={<HalamanDaftar />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            <Route path="/guru/dashboard" element={teacherPage(<DashboardGuru />)} />
            <Route path="/guru/materi" element={teacherPage(<KelolaMateriGuru />)} />
            <Route path="/guru/kelola-materi" element={teacherPage(<KelolaMateriGuru />)} />
            <Route path="/guru/bab" element={teacherPage(<KelolaBabGuru />)} />
            <Route path="/guru/latihan" element={teacherPage(<KelolaLatihanGuru />)} />
            <Route path="/guru/kelola-latihan" element={teacherPage(<KelolaLatihanGuru />)} />
            <Route path="/guru/quiz" element={teacherPage(<KelolaKuisGuru />)} />
            <Route path="/guru/penilaian" element={<Navigate to="/guru/statistik-siswa" replace />} />
            <Route path="/guru/penilaian-latihan" element={<Navigate to="/guru/statistik-siswa" replace />} />
            <Route path="/guru/hasil-latihan" element={<Navigate to="/guru/statistik-siswa" replace />} />
            <Route path="/guru/statistik" element={teacherPage(<StatistikSiswaGuru />)} />
            <Route path="/guru/statistik-siswa" element={teacherPage(<StatistikSiswaGuru />)} />
            <Route path="/guru/siswa" element={teacherPage(<KelolaSiswa />)} />
            <Route path="/guru/kelola-siswa" element={teacherPage(<KelolaSiswa />)} />
            <Route path="/guru/profil" element={teacherPage(<ProfilGuru />)} />

            <Route path="/dashboard-guru" element={teacherPage(<DashboardGuru />)} />
            <Route path="/dashboard-guru/profil" element={teacherPage(<ProfilGuru />)} />
            <Route path="/dashboard-guru/materi" element={teacherPage(<KelolaMateriGuru />)} />
            <Route path="/dashboard-guru/materi/bab" element={teacherPage(<KelolaBabGuru />)} />
            <Route path="/dashboard-guru/bab-pembelajaran" element={teacherPage(<KelolaBabGuru />)} />
            <Route path="/dashboard-guru/latihan" element={teacherPage(<KelolaLatihanGuru />)} />
            <Route path="/dashboard-guru/quiz" element={teacherPage(<KelolaKuisGuru />)} />
            <Route path="/dashboard-guru/penilaian" element={<Navigate to="/guru/statistik-siswa" replace />} />
            <Route path="/dashboard-guru/statistik-siswa" element={teacherPage(<StatistikSiswaGuru />)} />
            <Route path="/dashboard-guru/kelola-siswa" element={teacherPage(<KelolaSiswa />)} />

            <Route path="/siswa" element={<Navigate to="/siswa/dashboard" replace />} />
            <Route path="/siswa/dashboard" element={<DashboardSiswa />} />
            <Route path="/siswa/materi" element={<MateriSiswa />} />
            <Route path="/siswa/materi/:id" element={<DetailMateriSiswa />} />
            <Route path="/siswa/materi/:id/quiz" element={<KuisSiswa />} />
            <Route path="/siswa/bab/:id" element={<BabSiswa />} />
            <Route path="/siswa/bab/:id/latihan" element={<LatihanSiswa />} />
            <Route path="/siswa/bab/:id/quiz" element={<KuisSiswa />} />
            <Route path="/siswa/latihan-bab" element={<LatihanBabSiswa />} />
            <Route path="/siswa/latihan-bab/:id" element={<PengerjaanLatihanBabSiswa />} />
            <Route path="/siswa/latihan-bab/:id/hasil" element={<HasilLatihanBabSiswa />} />
            <Route path="/siswa/latihan-akhir" element={<LatihanAkhirSiswa />} />
            <Route path="/siswa/latihan-akhir/:id" element={<PengerjaanLatihanAkhirSiswa />} />
            <Route path="/siswa/latihan-akhir/:id/hasil" element={<HasilLatihanAkhirSiswa />} />
            <Route path="/siswa/nilai-progress" element={<NilaiSiswa />} />
            <Route path="/siswa/profil" element={<ProfilSiswa />} />

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}
