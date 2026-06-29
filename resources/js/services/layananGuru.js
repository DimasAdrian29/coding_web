import { api } from "./api";
function queryString(filters) {
  const query = new URLSearchParams();
  Object.entries(filters ?? {}).forEach(([key, value]) => {
    if (value !== null && value !== void 0 && value !== "") {
      query.set(key, String(value));
    }
  });
  return query.toString();
}
function filenameFromDisposition(disposition, fallback) {
  const match = disposition?.match(/filename="?([^"]+)"?/i);
  return match?.[1] ?? fallback;
}
async function downloadTeacherExport(path, fallbackFilename, filters) {
  const query = queryString(filters);
  const token = window.localStorage.getItem("token");
  const userId = window.localStorage.getItem("user_id");
  const response = await fetch(`/api${path}${query ? `?${query}` : ""}`, {
    credentials: "same-origin",
    headers: {
      Accept: "application/octet-stream",
      ...token ? { Authorization: `Bearer ${token}` } : {},
      ...userId ? { "X-User-Id": userId } : {}
    }
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message ?? "Gagal mengekspor data. Coba lagi.");
  }
  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = filenameFromDisposition(response.headers.get("Content-Disposition"), fallbackFilename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
}
const teacherService = {
  getDashboard: () => api.get("/teacher/dashboard"),
  getChapters: () => api.get("/teacher/chapters"),
  createChapter: (payload) => payload instanceof FormData ? api.postForm("/teacher/chapters", payload) : api.post("/teacher/chapters", payload),
  getChapter: (id) => api.get(`/teacher/chapters/${id}`),
  updateChapter: (id, payload) => payload instanceof FormData ? api.putForm(`/teacher/chapters/${id}`, payload) : api.put(`/teacher/chapters/${id}`, payload),
  deleteChapter: (id) => api.delete(`/teacher/chapters/${id}`),
  getExercises: () => api.get("/teacher/exercises"),
  getMateriGuru: () => api.get("/teacher/materi"),
  getBabByMateri: (materiId) => api.get(`/teacher/materi/${materiId}/bab`),
  getLatihanBabByMateri: (materiId) => api.get(`/teacher/materi/${materiId}/latihan-bab`),
  getLatihanAkhirByMateri: (materiId) => api.get(`/teacher/materi/${materiId}/latihan-akhir`),
  createExercise: (payload) => api.post("/teacher/exercises", payload),
  updateExercise: (id, payload) => api.put(`/teacher/exercises/${id}`, payload),
  deleteExercise: (id) => api.delete(`/teacher/exercises/${id}`),
  getExerciseQuestions: (id) => api.get(`/teacher/exercises/${id}/questions`),
  createExerciseQuestion: (id, payload) => api.post(`/teacher/exercises/${id}/questions`, payload),
  updateExerciseQuestion: (id, payload) => api.put(`/teacher/questions/${id}`, payload),
  deleteExerciseQuestion: (id) => api.delete(`/teacher/questions/${id}`),
  getStatistics: (filters) => api.get(`/teacher/statistics${queryString(filters) ? `?${queryString(filters)}` : ""}`),
  getGrades: (filters) => api.get(`/teacher/statistics${queryString(filters) ? `?${queryString(filters)}` : ""}`),
  getStudentStatisticsHistory: (studentId, filters) => api.get(`/teacher/statistics/students/${studentId}/history${queryString(filters) ? `?${queryString(filters)}` : ""}`),
  deleteExerciseAttempt: (attemptId) => api.delete(`/teacher/exercise-attempts/${attemptId}`),
  getStudents: (filters) => api.get(`/teacher/students${queryString(filters) ? `?${queryString(filters)}` : ""}`),
  updateStudent: (studentId, payload) => api.put(`/teacher/students/${studentId}`, payload),
  resetStudentPassword: (studentId) => api.patch(`/teacher/students/${studentId}/reset-password`),
  deleteStudent: (studentId) => api.delete(`/teacher/students/${studentId}`),
  exportGradesPdf: (filters) => downloadTeacherExport("/teacher/statistics/export/pdf", "nilai-siswa.pdf", filters),
  exportGradesExcel: (filters) => downloadTeacherExport("/teacher/statistics/export/excel", "nilai-siswa.xls", filters),
  getProfile: () => api.get("/teacher/profile"),
  getTeacherProfile: () => api.get("/teacher/profile"),
  updateTeacherProfile: (payload) => api.put("/teacher/profile", payload),
  updateTeacherPassword: (payload) => api.put("/teacher/profile/password", payload),
  exportStudentGradesPdf: (filters) => downloadTeacherExport("/teacher/exports/student-grades/pdf", "rekap-nilai-siswa.pdf", filters),
  exportStudentGradesExcel: (filters) => downloadTeacherExport("/teacher/exports/student-grades/excel", "rekap-nilai-siswa.xls", filters),
  exportSubmissionsPdf: (filters) => downloadTeacherExport("/teacher/exports/submissions/pdf", "rekap-penilaian-latihan.pdf", filters),
  exportSubmissionsExcel: (filters) => downloadTeacherExport("/teacher/exports/submissions/excel", "rekap-penilaian-latihan.xls", filters),
  exportStatisticsPdf: (filters) => downloadTeacherExport("/teacher/statistics/export/pdf", "rekap-statistik-siswa.pdf", filters),
  exportStatisticsExcel: (filters) => downloadTeacherExport("/teacher/statistics/export/excel", "rekap-statistik-siswa.xls", filters)
};
export {
  teacherService
};
