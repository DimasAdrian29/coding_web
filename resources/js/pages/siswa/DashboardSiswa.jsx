import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Bell,
  BookOpen,
  CheckCircle,
  ClipboardCheck,
  FileText,
  TrendingUp,
  Trophy,
} from "lucide-react";
import SidebarSiswa, { MobileMenuSiswa } from "../../components/layout/SidebarSiswa";
import { studentService } from "../../services/layananSiswa";
import { useAuth } from "../../context/KonteksAuth";
const buildStats = (studentData) => [
  {
    value: `${studentData.totalMaterials ?? 0}`,
    label: "Total Materi",
    icon: BookOpen,
    iconClass: "bg-[#EFF6FF] text-[#2563EB]"
  },
  {
    value: `${studentData.totalChapters ?? 0}`,
    label: "Total Bab",
    icon: ClipboardCheck,
    iconClass: "bg-[#DBEAFE] text-[#2563EB]"
  },
  {
    value: `${studentData.completedChapters} Bab`,
    label: "Bab Selesai",
    icon: CheckCircle,
    iconClass: "bg-[#DBEAFE] text-[#2563EB]"
  },
  {
    value: `${studentData.completedExercises ?? 0}`,
    label: "Latihan Selesai",
    icon: FileText,
    iconClass: "bg-[#EFF6FF] text-[#2563EB]"
  },
  {
    value: `${studentData.averageScore ?? 0}`,
    label: "Rata-rata Nilai",
    icon: Award,
    iconClass: "bg-[#F3E8FF] text-[#A855F7]"
  },
  {
    value: `${studentData.finalExamScore ?? "-"}`,
    label: "Nilai Latihan Akhir",
    icon: Trophy,
    iconClass: "bg-[#FAF5FF] text-[#A855F7]"
  }
];
function Header({ data }) {
  return <header>
            <h2 className="text-2xl font-bold tracking-normal text-[#0F172A]">
                Selamat Datang, {data.studentName}
            </h2>
            <p className="mt-2 text-sm font-medium text-[#64748B]">
                {data.dashboardSubtitle || "Silakan pilih materi untuk memulai pembelajaran."}
            </p>
        </header>;
}
function ProgressCard({ data }) {
  const navigate = useNavigate();
  const percentage = data.progressPercentage;
  return <section className="min-h-[250px] overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white shadow-md">
            <div className="flex h-full flex-col gap-8 md:flex-row md:items-start md:justify-between">
                <div className="w-full max-w-2xl">
                    <p className="text-sm font-semibold text-white/80">Progress Pembelajaran Kamu</p>
                    <h3 className="mt-3 text-3xl font-extrabold tracking-normal">
                        {data.completedChapters} dari {data.totalChapters} Bab Selesai
                    </h3>
                    <p className="mt-2 text-sm font-medium text-white/80">
                        {data.progressText || "Belum memulai pembelajaran"}
                    </p>

                    <div className="mt-8">
                        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-white/90">
                            <span>Progress</span>
                            <span>{percentage}%</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-white/20">
                            <div
    className="h-full rounded-full bg-white"
    style={{ width: `${percentage}%` }}
  />
                        </div>
                    </div>

                    <button
    type="button"
    onClick={() => navigate(data.continueHref || "/siswa/materi")}
    className="mt-7 inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#2563EB] transition hover:bg-[#EFF6FF]"
  >
                        {data.continueLabel || "Lanjut Belajar"}
                    </button>
                </div>

                <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white md:size-24">
                    <TrendingUp size={44} strokeWidth={1.8} />
                </div>
            </div>
        </section>;
}
function StatsGrid({ data }) {
  const stats = buildStats(data);
  return <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {stats.map((item) => {
    const Icon = item.icon;
    return <article
      key={item.label}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
                        <div className="flex items-center gap-4">
                            <div
      className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${item.iconClass}`}
    >
                                <Icon size={22} />
                            </div>
                            <div>
                                <p className="text-2xl font-extrabold text-[#0F172A]">{item.value}</p>
                                <p className="mt-1 text-sm font-medium text-[#64748B]">{item.label}</p>
                            </div>
                        </div>
                    </article>;
  })}
        </section>;
}
function NotificationCard({ data }) {
  const navigate = useNavigate();
  return <section className="min-h-[250px] rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                    <Bell size={20} />
                </div>
                <h3 className="text-lg font-extrabold text-[#0F172A]">Notifikasi</h3>
            </div>

            <div className="space-y-3">
                {data.notifications.length === 0 ? <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-[#64748B]">
                        Belum ada data.
                    </div> : data.notifications.map((item) => {
    const className = item.type === "warning" ? "border-orange-200 bg-[#FFF7ED] text-orange-700" : "border-blue-200 bg-blue-50 text-blue-700";
    const buttonClass = item.type === "warning" ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-blue-500 text-white hover:bg-blue-600";
    return <div
      key={item.title}
      className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
                        <p className="text-sm font-bold">{item.title}</p>
                        <button
      type="button"
      onClick={() => navigate(item.href)}
      className={`inline-flex w-fit items-center justify-center rounded-lg px-3 py-2 text-xs font-bold transition ${buttonClass}`}
    >
                            {item.action}
                        </button>
                    </div>;
  })}
            </div>
        </section>;
}
function ActivityCard({ data }) {
  return <section className="min-h-[250px] rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                    <Award size={20} />
                </div>
                <h3 className="text-lg font-extrabold text-[#0F172A]">Aktivitas Terbaru</h3>
            </div>

            <div className="space-y-3">
                {data.activities.length === 0 ? <div className="rounded-lg bg-slate-50 p-4 text-sm font-semibold text-[#64748B]">
                        Belum ada data.
                    </div> : data.activities.map((item) => <div key={item.title} className="flex gap-3 rounded-lg bg-slate-50 p-4">
                        <div
    className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]"
  >
                            <CheckCircle size={17} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#0F172A]">{item.title}</p>
                            <p className="mt-1 text-xs font-medium text-[#64748B]">{item.time}</p>
                        </div>
                    </div>)}
            </div>
        </section>;
}
function StudentDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await studentService.getDashboard();
        setData(response);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat data. Coba lagi.");
      } finally {
        setLoading(false);
      }
    };
    void loadDashboard();
  }, [user?.id]);
  return <div className="min-h-screen bg-slate-50 font-sans text-[#0F172A] lg:flex">
            {data ? <SidebarSiswa /> : null}

            <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <div className="space-y-6">
                    {loading ? <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-[#64748B] shadow-sm">
                            Memuat data...
                        </div> : error || !data ? <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-600 shadow-sm">
                            Gagal memuat data. Coba lagi.
                        </div> : <>
                    <MobileMenuSiswa />
                    <Header data={data} />
                    <ProgressCard data={data} />
                    <StatsGrid data={data} />

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <NotificationCard data={data} />
                        <ActivityCard data={data} />
                    </div>
                        </>}
                </div>
            </main>
        </div>;
}
export {
  StudentDashboardPage as default
};
