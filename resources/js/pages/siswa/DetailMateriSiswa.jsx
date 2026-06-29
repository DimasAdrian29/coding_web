import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock, FileText } from "lucide-react";
import { studentService } from "../../services/layananSiswa";
function getYoutubeEmbedUrl(url) {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : "";
}
function StudentMaterialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const loadChapter = async () => {
      if (!id) return;
      setLoading(true);
      setError("");
      try {
        const response = await studentService.getChapterDetail(id);
        setChapter(response.chapter);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat data.");
      } finally {
        setLoading(false);
      }
    };
    void loadChapter();
  }, [id]);
  const completeAndContinue = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const response = await studentService.completeChapter(id);
      if (response.next_action === "exercise" && response.exercise_id) {
        navigate(`/siswa/latihan-bab/${response.exercise_id}`);
      } else {
        navigate("/siswa/latihan-bab");
      }
    } catch (saveError) {
      window.alert(saveError instanceof Error ? saveError.message : "Gagal menyimpan progress.");
    } finally {
      setSaving(false);
    }
  };
  return <div className="min-h-screen bg-slate-50 px-4 py-6 font-sans text-[#0F172A] sm:px-6 lg:px-8 lg:py-8">
            <main className="mx-auto max-w-5xl space-y-6">
                <button
    type="button"
    onClick={() => navigate("/siswa/materi")}
    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#2563EB] shadow-sm transition hover:bg-[#EFF6FF]"
  >
                    <ArrowLeft size={18} />
                    Kembali ke Materi
                </button>

                {loading ? <StateCard text="Memuat data..." /> : error ? <StateCard text="Gagal memuat data." danger /> : !chapter ? <StateCard text="Materi tidak ditemukan." /> : <>
                        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 inline-flex rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-bold text-[#2563EB]">
                                {chapter.materialTitle ? `${chapter.materialTitle} | ` : ""}Bab {chapter.order}
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-normal text-[#0F172A]">
                                {chapter.title}
                            </h1>
                            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#64748B]">
                                {chapter.description}
                            </p>
                        </header>

                        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <InfoCard icon={<Clock size={20} />} label="Durasi" value={`${chapter.durationMinutes} menit`} />
                            <InfoCard icon={<FileText size={20} />} label="Status" value={chapter.status === "completed" ? "Selesai" : "Sedang Dipelajari"} />
                            <InfoCard icon={<CheckCircle size={20} />} label="Progress" value={`${chapter.progressPercentage}%`} />
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-extrabold text-[#0F172A]">Isi Materi</h2>
                            <div className="mt-4 whitespace-pre-line text-sm leading-7 text-[#334155]">
                                {chapter.content || "Belum ada isi materi."}
                            </div>
                        </section>

                        <CodeExampleSection chapter={chapter} />

                        <VideoPlayer chapter={chapter} />

                        <footer className="flex flex-col-reverse gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:justify-end">
                            <button
    type="button"
    onClick={() => navigate("/siswa/materi")}
    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#0F172A] transition hover:bg-slate-50"
  >
                                Kembali
                            </button>
                            <button
    type="button"
    disabled={saving}
    onClick={completeAndContinue}
    className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
  >
                                {saving ? "Menyimpan..." : "Tandai Selesai & Lanjut Latihan"}
                            </button>
                        </footer>
                    </>}
            </main>
        </div>;
}
function CodeExampleSection({ chapter }) {
  const title = chapter.judulContohKode ?? chapter.judul_contoh_kode ?? "";
  const language = chapter.bahasaPemrograman ?? chapter.bahasa_pemrograman ?? "";
  const code = chapter.contohKode ?? chapter.contoh_kode ?? chapter.codeExample ?? "";
  const explanation = chapter.penjelasanKode ?? chapter.penjelasan_kode ?? "";
  const hasCodeExample = [title, language, code, explanation].some((value) => String(value ?? "").trim() !== "");

  if (!hasCodeExample) return null;

  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-[#0F172A]">{title || "Contoh Kode Program"}</h2>
            {language ? <p className="mt-3 text-sm font-semibold text-[#334155]">Bahasa : {language}</p> : null}
            {code ? <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-5 text-sm leading-7 text-blue-50 shadow-inner">
                    <code className="font-mono">{code}</code>
                </pre> : null}
            {explanation ? <div className="mt-4">
                    <p className="text-sm font-extrabold text-[#0F172A]">Penjelasan:</p>
                    <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#334155]">{explanation}</p>
                </div> : null}
        </section>;
}
function VideoPlayer({ chapter }) {
  const videoType = chapter.videoType ?? chapter.video_type;
  const youtubeUrl = chapter.videoUrl ?? chapter.video_url;
  const videoFileUrl = chapter.videoFileUrl ?? chapter.video_file_url;
  const embedUrl = getYoutubeEmbedUrl(youtubeUrl);
  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-[#0F172A]">Video Pembelajaran</h2>
            {videoType === "youtube" && embedUrl ? <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
                    <iframe
      src={embedUrl}
      title="Video Pembelajaran"
      className="h-full w-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
                </div> : null}
            {videoType === "upload" && videoFileUrl ? <video controls className="mt-4 w-full rounded-xl bg-black">
                    <source src={videoFileUrl} />
                    Browser kamu tidak mendukung pemutar video.
                </video> : null}
            {!(videoType === "youtube" && embedUrl) && !(videoType === "upload" && videoFileUrl) ? <p className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                    Video pembelajaran belum tersedia untuk bab ini.
                </p> : null}
        </section>;
}
function InfoCard({ icon, label, value }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                    {icon}
                </div>
                <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#94A3B8]">{label}</p>
                    <p className="mt-1 text-sm font-extrabold text-[#0F172A]">{value}</p>
                </div>
            </div>
        </article>;
}
function StateCard({ text, danger = false }) {
  return <div className={`rounded-2xl border bg-white p-6 text-sm font-semibold shadow-sm ${danger ? "border-red-200 text-red-600" : "border-slate-200 text-[#64748B]"}`}>
            {text}
        </div>;
}
export {
  StudentMaterialDetail as default
};
