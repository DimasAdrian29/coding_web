import { useEffect, useMemo, useState } from "react";
import { Award, BookOpen, ClipboardCheck, FileText, RefreshCw, TrendingUp, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { teacherService } from "../services/layananGuru";

const emptyStats = {
  totalMateri: 0,
  materiAktif: 0,
  totalBab: 0,
  babPublished: 0,
  totalSiswa: 0,
  siswaAktif: 0,
  totalLatihan: 0,
  latihanPerBab: 0
};

function buildStatCards(stats) {
  return [
    {
      icon: BookOpen,
      value: stats.totalMateri,
      suffix: "Materi",
      label: "Total Materi",
      meta: `${stats.materiAktif} aktif`
    },
    {
      icon: FileText,
      value: stats.totalBab,
      suffix: "Bab",
      label: "Total Bab",
      meta: `${stats.babPublished} published`
    },
    {
      icon: Users,
      value: stats.totalSiswa,
      suffix: "Siswa",
      label: "Total Siswa",
      meta: `${stats.siswaAktif} aktif`
    },
    {
      icon: ClipboardCheck,
      value: stats.totalLatihan,
      suffix: "Latihan",
      label: "Total Latihan",
      meta: `${stats.latihanPerBab} per bab`
    }
  ];
}

function DashboardHeader({ teacherName, onRefresh }) {
  return (
    <header className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Dashboard Guru</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal text-slate-900">
            Selamat datang, {teacherName || "Guru"}
          </h1>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100 sm:w-auto"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>
    </header>
  );
}

function StatCards({ stats }) {
  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {buildStatCards(stats).map((item) => {
        const Icon = item.icon;
        return (
          <article key={item.label} className="min-h-[160px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Icon size={23} />
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                {item.meta}
              </span>
            </div>
            <p className="mt-6 text-3xl font-black text-slate-900">
              {item.value}
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">{item.suffix}</p>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{item.label}</p>
          </article>
        );
      })}
    </section>
  );
}

function ChartCard({ title, icon, empty, children }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          {icon}
        </div>
      </div>
      <div className="h-[310px]">
        {empty ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-sm font-semibold text-slate-500">
            Belum ada data.
          </div>
        ) : children}
      </div>
    </article>
  );
}

function ChartsSection({ visitData, chapterProgressData }) {
  return (
    <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
      <ChartCard
        title="Kunjungan Siswa"
        empty={visitData.length === 0}
        icon={<TrendingUp size={20} />}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={visitData} margin={{ top: 12, right: 16, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
            <XAxis dataKey="hari" tick={{ fill: "#64748B", fontSize: 12 }} />
            <YAxis tick={{ fill: "#64748B", fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="kunjungan" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, fill: "#2563EB" }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Progress Per Bab"
        empty={chapterProgressData.length === 0}
        icon={<Award size={20} />}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chapterProgressData} margin={{ top: 12, right: 16, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
            <XAxis dataKey="bab" tick={{ fill: "#64748B", fontSize: 12 }} />
            <YAxis tick={{ fill: "#64748B", fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="selesai" name="Selesai" fill="#2563EB" radius={[8, 8, 0, 0]} />
            <Bar dataKey="sedangBelajar" name="Sedang Belajar" fill="#93C5FD" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </section>
  );
}

export default function TeacherDashboardPage() {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      setPayload(await teacherService.getDashboard());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat dashboard guru.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const stats = payload?.stats ?? emptyStats;
  const visitData = useMemo(() => payload?.student_visits_chart ?? payload?.studentVisits ?? [], [payload]);
  const chapterProgressData = useMemo(() => payload?.chapter_progress_chart ?? payload?.chapterProgress ?? [], [payload]);

  if (loading) {
    return <div className="px-8 py-8 text-sm font-semibold text-slate-500">Memuat dashboard guru...</div>;
  }

  if (error) {
    return (
      <div className="px-8 py-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-600">
          Gagal memuat dashboard guru.
          <button type="button" onClick={() => void loadDashboard()} className="ml-3 underline">
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      <DashboardHeader teacherName={payload?.teacherName} onRefresh={() => void loadDashboard()} />
      <StatCards stats={stats} />
      <ChartsSection visitData={visitData} chapterProgressData={chapterProgressData} />
    </div>
  );
}
