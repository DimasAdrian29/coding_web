import { useEffect, useMemo, useState } from "react";
import { Award, CheckCircle, Eye, FileSpreadsheet, FileText, Trash2, Users, X } from "lucide-react";
import { teacherService } from "../../services/layananGuru";

function formatScore(score) {
  return score === null || score === undefined || score === "" ? "-" : score;
}

function TeacherStatisticsPage() {
  const [selectedMateri, setSelectedMateri] = useState("");
  const [selectedBab, setSelectedBab] = useState("");
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(null);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [historyPayload, setHistoryPayload] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [deletingAttempt, setDeletingAttempt] = useState(null);

  const loadGrades = async (materiId = selectedMateri, babId = selectedBab) => {
    setLoading(true);
    setError("");
    try {
      const response = await teacherService.getStatistics(materiId ? { materi_id: materiId, bab_id: babId } : {});
      setPayload(response);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat nilai siswa.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadGrades("");
  }, []);

  useEffect(() => {
    if (selectedMateri) {
      void loadGrades(selectedMateri, selectedBab);
    }
  }, [selectedBab, selectedMateri]);

  const materis = payload?.materis ?? payload?.materials ?? [];
  const chapters = payload?.chapters ?? [];
  const allChapters = payload?.all_chapters ?? chapters;
  const students = payload?.students ?? [];
  const stats = payload?.stats ?? {
    totalStudents: 0,
    averageScore: 0,
    completedStudents: 0,
    incompleteStudents: 0
  };
  const summary = payload?.summary;
  const cardStats = {
    totalStudents: summary?.total_students ?? stats.totalStudents,
    averageScore: summary?.average_score ?? stats.averageScore,
    completedStudents: summary?.completed_students ?? stats.completedStudents,
    incompleteStudents: summary?.not_completed_students ?? stats.incompleteStudents
  };

  const selectedMaterialTitle = useMemo(() => {
    return materis.find((materi) => String(materi.id) === String(selectedMateri))?.title ?? "";
  }, [materis, selectedMateri]);

  const handleExport = async (type) => {
    if (!selectedMateri) return;
    setExporting(type);
    try {
      if (type === "pdf") {
        await teacherService.exportGradesPdf({ materi_id: selectedMateri, bab_id: selectedBab });
      } else {
        await teacherService.exportGradesExcel({ materi_id: selectedMateri, bab_id: selectedBab });
      }
    } catch (exportError) {
      window.alert(exportError instanceof Error ? exportError.message : "Gagal mengekspor nilai.");
    } finally {
      setExporting(null);
    }
  };

  const openHistory = async (student) => {
    if (!selectedMateri) return;
    setSelectedStudent(student);
    setHistoryPayload(null);
    setHistoryLoading(true);
    try {
      const response = await teacherService.getStudentStatisticsHistory(student.id, { materi_id: selectedMateri, bab_id: selectedBab });
      setHistoryPayload(response);
    } catch (historyError) {
      window.alert(historyError instanceof Error ? historyError.message : "Gagal memuat detail riwayat.");
      setSelectedStudent(null);
    } finally {
      setHistoryLoading(false);
    }
  };

  const deleteAttempt = async (attemptId) => {
    if (!attemptId || !selectedStudent) return;
    const confirmed = window.confirm("Yakin ingin menghapus riwayat latihan ini? Data yang dihapus tidak dapat dikembalikan.");

    if (!confirmed) return;

    setDeletingAttempt(attemptId);
    try {
      await teacherService.deleteExerciseAttempt(attemptId);
      await openHistory(selectedStudent);
      if (selectedMateri) {
        await loadGrades(selectedMateri, selectedBab);
      }
    } catch (deleteError) {
      window.alert(deleteError instanceof Error ? deleteError.message : "Gagal menghapus riwayat latihan.");
    } finally {
      setDeletingAttempt(null);
    }
  };

  return (
    <div className="px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Statistik dan Nilai Siswa</h1>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-col gap-4 md:flex-row">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Pilih Materi</span>
              <select
                value={selectedMateri}
                onChange={(event) => {
                  setSelectedMateri(event.target.value);
                  setSelectedBab("");
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 md:w-96"
              >
                <option value="">Pilih Materi</option>
                {materis.map((materi) => (
                  <option key={materi.id} value={materi.id}>{materi.title}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Pilih Bab</span>
              <select
                value={selectedBab}
                onChange={(event) => setSelectedBab(event.target.value)}
                disabled={!selectedMateri}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400 md:w-96"
              >
                <option value="">{selectedMateri ? "Semua Bab" : "Pilih materi terlebih dahulu"}</option>
                {allChapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.title ?? chapter.judul_bab ?? chapter.nama_bab}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={!selectedMateri || Boolean(exporting)}
              onClick={() => void handleExport("pdf")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileText size={17} />
              {exporting === "pdf" ? "Mengunduh..." : "Export PDF"}
            </button>
            <button
              type="button"
              disabled={!selectedMateri || Boolean(exporting)}
              onClick={() => void handleExport("excel")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 bg-white px-4 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileSpreadsheet size={17} />
              {exporting === "excel" ? "Mengunduh..." : "Export Excel"}
            </button>
          </div>
        </div>
      </section>

      {loading ? (
        <StateCard text="Memuat data..." />
      ) : error ? (
        <StateCard text={error} danger />
      ) : !selectedMateri ? (
        <StateCard text="Silakan pilih materi terlebih dahulu untuk melihat nilai siswa." />
      ) : (
        <>
          <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={<Users size={25} />} label="Total Siswa" value={cardStats.totalStudents} />
            <StatCard icon={<Award size={25} />} label="Rata-rata Nilai" value={cardStats.averageScore ?? 0} />
            <StatCard icon={<CheckCircle size={25} />} label="Siswa Selesai" value={cardStats.completedStudents} />
            <StatCard icon={<FileText size={25} />} label="Siswa Belum Selesai" value={cardStats.incompleteStudents} />
          </section>

          <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-xl font-extrabold text-slate-900">Tabel Nilai Siswa</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead>NISN</TableHead>
                    {chapters.map((chapter) => (
                      <TableHead key={chapter.id}>Bab {chapter.order_number}</TableHead>
                    ))}
                    <TableHead>Latihan Akhir</TableHead>
                    <TableHead>Rata-rata</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Riwayat</TableHead>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {students.map((student, index) => (
                    <tr key={student.id} className="hover:bg-slate-50">
                      <td className="px-6 py-5 text-sm font-bold text-slate-500">{index + 1}</td>
                      <td className="min-w-[220px] px-6 py-5 text-sm font-extrabold text-slate-900">{student.name}</td>
                      <td className="px-6 py-5 text-sm font-semibold text-slate-600">{student.nisn || "-"}</td>
                      {chapters.map((chapter) => (
                        <td key={chapter.id} className="px-6 py-5 text-sm font-bold text-slate-700">
                          {formatScore(student.chapter_scores?.[String(chapter.id)])}
                        </td>
                      ))}
                      <td className="px-6 py-5 text-sm font-bold text-slate-700">{formatScore(student.final_score)}</td>
                      <td className="px-6 py-5">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-extrabold text-blue-700">{formatScore(student.average_score)}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${student.status === "Selesai" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <button
                          type="button"
                          onClick={() => void openHistory(student)}
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
                        >
                          <Eye size={17} />
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {students.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm font-semibold text-slate-500">Belum ada data siswa.</div>
              ) : null}
            </div>
          </section>
        </>
      )}

      {selectedStudent ? (
        <HistoryModal
          student={selectedStudent}
          payload={historyPayload}
          loading={historyLoading}
          deletingAttempt={deletingAttempt}
          materiTitle={selectedMaterialTitle}
          onDeleteAttempt={deleteAttempt}
          onClose={() => {
            setSelectedStudent(null);
            setHistoryPayload(null);
          }}
        />
      ) : null}
    </div>
  );
}

function TableHead({ children }) {
  return <th className="whitespace-nowrap px-6 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">{children}</th>;
}

function StatCard({ icon, label, value }) {
  return (
    <article className="flex min-h-[110px] items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex size-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">{icon}</div>
      <div>
        <p className="text-2xl font-extrabold text-slate-900">{value}</p>
        <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
      </div>
    </article>
  );
}

function HistoryModal({ student, payload, loading, deletingAttempt, materiTitle, onDeleteAttempt, onClose }) {
  const history = payload?.histories ?? [];
  const finalHistory = payload?.final_exam_histories ?? [];
  const studentInfo = payload?.student ?? student;
  const materialTitle = payload?.materi?.title ?? materiTitle;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Riwayat Nilai Siswa</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">{studentInfo.name} - {materialTitle}</p>
            <p className="mt-1 text-xs font-semibold text-slate-400">NISN: {studentInfo.nisn || "-"}</p>
          </div>
          <button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-50">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <StateCard text="Memuat detail riwayat..." />
          ) : history.length === 0 && finalHistory.length === 0 ? (
            <StateCard text="Belum ada riwayat pengerjaan." />
          ) : (
            <div className="space-y-6">
              <HistoryTable title="Riwayat Latihan Per Bab" items={history} deletingAttempt={deletingAttempt} onDeleteAttempt={onDeleteAttempt} />
              <HistoryTable title="Riwayat Latihan Akhir" items={finalHistory.map((item) => ({ ...item, chapter_title: "Latihan Akhir" }))} deletingAttempt={deletingAttempt} onDeleteAttempt={onDeleteAttempt} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HistoryTable({ title, items, deletingAttempt, onDeleteAttempt }) {
  return (
    <section>
      <h4 className="mb-3 text-base font-extrabold text-slate-900">{title}</h4>
      {items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-500">Belum ada data.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50">
              <tr>
                {["No", "Bab", "Latihan", "Percobaan", "Nilai", "Benar", "Salah", "Tanggal", "Aksi"].map((heading) => (
                  <TableHead key={heading}>{heading}</TableHead>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, index) => (
                <tr key={`${item.exercise_title}-${item.attempt_number}-${item.submitted_at}-${item.attempt_id ?? index}`} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-bold text-slate-500">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700">{item.chapter_title}</td>
                  <td className="min-w-[220px] px-6 py-4 text-sm font-semibold text-slate-700">{item.exercise_title}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">Ke-{item.attempt_number}</td>
                  <td className="px-6 py-4 text-sm font-bold text-blue-700">{item.score}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{item.correct_answers}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{item.wrong_answers}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-500">{item.submitted_at}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <button
                      type="button"
                      disabled={!item.attempt_id || deletingAttempt === item.attempt_id}
                      onClick={() => onDeleteAttempt(item.attempt_id)}
                      className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      {deletingAttempt === item.attempt_id ? "Menghapus..." : "Hapus"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function StateCard({ text, danger = false }) {
  return (
    <div className={`mt-8 rounded-2xl border bg-white p-6 text-sm font-semibold shadow-sm ${danger ? "border-red-200 text-red-600" : "border-slate-200 text-slate-500"}`}>
      {text}
    </div>
  );
}

export {
  TeacherStatisticsPage as default
};
