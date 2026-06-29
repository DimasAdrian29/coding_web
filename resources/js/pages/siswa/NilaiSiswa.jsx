import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  FileText,
  Trophy,
} from "lucide-react";
import SidebarSiswa, { MobileMenuSiswa } from "../../components/layout/SidebarSiswa";
import { studentService } from "../../services/layananSiswa";

function PageHeader() {
  return (
    <header className="flex items-center gap-4">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
        <Award size={24} />
      </div>
      <div>
        <h2 className="text-2xl font-bold tracking-normal text-slate-900">Nilai Saya</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Lihat nilai latihan per bab dan latihan akhir yang sudah kamu kerjakan.
        </p>
      </div>
    </header>
  );
}

function MaterialFilter({ materials, chapters, selectedMaterial, selectedBab, onMaterialChange, onBabChange }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Pilih Materi</span>
          <select
            value={selectedMaterial}
            onChange={(event) => onMaterialChange(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 md:w-96"
          >
            <option value="">Semua Materi</option>
            {materials.map((material) => (
              <option key={material.id} value={String(material.id)}>
                {material.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Pilih Bab</span>
          <select
            value={selectedBab}
            onChange={(event) => onBabChange(event.target.value)}
            disabled={!selectedMaterial}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400 md:w-96"
          >
            <option value="">{selectedMaterial ? "Semua Bab" : "Pilih materi terlebih dahulu"}</option>
            {chapters.map((chapter) => (
              <option key={chapter.id} value={String(chapter.id)}>
                {chapter.judul_bab ?? chapter.title ?? chapter.nama_bab}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}

function SummaryCards({ summary }) {
  const cards = [
    { label: "Total Latihan Dikerjakan", value: summary.total_attempts ?? 0, icon: FileText },
    { label: "Rata-rata Nilai", value: summary.average_score ?? 0, icon: Award },
    { label: "Nilai Tertinggi", value: summary.highest_score ?? "-", icon: Trophy },
    { label: "Jumlah Materi Diikuti", value: summary.materials_count ?? 0, icon: BookOpen }
  ];

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article key={card.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-3xl font-extrabold text-slate-900">{card.value}</p>
                <p className="mt-2 text-sm font-semibold text-slate-500">{card.label}</p>
              </div>
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Icon size={22} />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function ScoreTable({ title, columns, rows, renderRow, emptyText }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h3 className="text-xl font-extrabold text-slate-900">{title}</h3>
      </div>
      {rows.length === 0 ? (
        <div className="p-6 text-sm font-semibold text-slate-500">{emptyText}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="whitespace-nowrap px-6 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map(renderRow)}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function ScoreBadge({ score }) {
  return <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-extrabold text-blue-700">{score}</span>;
}

function StudentScoresPage() {
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedBab, setSelectedBab] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filters = useMemo(() => (
    selectedMaterial ? { materi_id: selectedMaterial, bab_id: selectedBab } : {}
  ), [selectedBab, selectedMaterial]);

  useEffect(() => {
    const loadScores = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await studentService.getScores(filters);
        setData(response);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat data nilai.");
      } finally {
        setLoading(false);
      }
    };

    void loadScores();
  }, [filters]);

  const materials = data?.materials ?? [];
  const chapters = data?.chapters ?? [];
  const summary = data?.summary ?? {};
  const chapterScores = data?.chapter_scores ?? [];
  const finalScores = data?.final_scores ?? [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 lg:flex">
      <SidebarSiswa />

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="space-y-6">
          <MobileMenuSiswa />
          <PageHeader />
          <MaterialFilter
            materials={materials}
            chapters={chapters}
            selectedMaterial={selectedMaterial}
            selectedBab={selectedBab}
            onMaterialChange={(value) => {
              setSelectedMaterial(value);
              setSelectedBab("");
            }}
            onBabChange={setSelectedBab}
          />

          {loading ? (
            <StateCard text="Memuat data nilai..." />
          ) : error ? (
            <StateCard text={error} danger />
          ) : (
            <>
              <SummaryCards summary={summary} />
              <ScoreTable
                title="Nilai Latihan Per Bab"
                columns={["Materi", "Bab", "Latihan", "Percobaan Ke", "Benar", "Salah", "Nilai", "Tanggal"]}
                rows={chapterScores}
                emptyText="Belum ada nilai latihan per bab."
                renderRow={(row) => (
                  <tr key={`chapter-${row.id}`} className="hover:bg-slate-50">
                    <td className="min-w-[220px] px-6 py-5 text-sm font-semibold text-slate-700">{row.material_title}</td>
                    <td className="min-w-[220px] px-6 py-5 text-sm font-semibold text-slate-700">{row.chapter_title}</td>
                    <td className="min-w-[220px] px-6 py-5 text-sm font-extrabold text-slate-900">{row.exercise_title}</td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-700">Ke-{row.attempt_number}</td>
                    <td className="px-6 py-5 text-sm font-bold text-blue-700">{row.correct_answers}</td>
                    <td className="px-6 py-5 text-sm font-bold text-red-600">{row.wrong_answers}</td>
                    <td className="px-6 py-5"><ScoreBadge score={row.score} /></td>
                    <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-slate-500">{row.submitted_at}</td>
                  </tr>
                )}
              />
              <ScoreTable
                title="Nilai Latihan Akhir"
                columns={["Materi", "Latihan Akhir", "Percobaan Ke", "Benar", "Salah", "Nilai", "Tanggal"]}
                rows={finalScores}
                emptyText="Belum ada nilai latihan akhir."
                renderRow={(row) => (
                  <tr key={`final-${row.id}`} className="hover:bg-slate-50">
                    <td className="min-w-[220px] px-6 py-5 text-sm font-semibold text-slate-700">{row.material_title}</td>
                    <td className="min-w-[240px] px-6 py-5 text-sm font-extrabold text-slate-900">{row.exercise_title}</td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-700">Ke-{row.attempt_number}</td>
                    <td className="px-6 py-5 text-sm font-bold text-blue-700">{row.correct_answers}</td>
                    <td className="px-6 py-5 text-sm font-bold text-red-600">{row.wrong_answers}</td>
                    <td className="px-6 py-5"><ScoreBadge score={row.score} /></td>
                    <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-slate-500">{row.submitted_at}</td>
                  </tr>
                )}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function StateCard({ text, danger = false }) {
  return (
    <div className={`rounded-xl border bg-white p-6 text-sm font-semibold shadow-sm ${danger ? "border-red-200 text-red-600" : "border-slate-200 text-slate-500"}`}>
      {text}
    </div>
  );
}

export {
  StudentScoresPage as default
};
