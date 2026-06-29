import { api } from "./api";
const studentService = {
  getDashboard: () => api.get("/student/dashboard"),
  getLearningFlow: () => api.get("/student/learning-flow"),
  getChapters: () => api.get("/student/chapters"),
  getChapterDetail: (id) => api.get(`/student/chapters/${id}`),
  updateChapterProgress: (id, payload) => api.post(`/student/chapters/${id}/progress`, payload),
  completeChapter: (id) => api.post(`/siswa/bab/${id}/selesai`, {}),
  getExercises: (type = "chapter") => api.get(`/student/exercises?type=${type}`),
  getExerciseDetail: (id) => api.get(`/student/exercises/${id}`),
  getExerciseAttempts: (id) => api.get(`/student/exercises/${id}/attempts`),
  getExerciseSubmission: (id) => api.get(`/student/exercises/${id}/submission`),
  submitExercise: (id, payload) => api.post(`/student/exercises/${id}/submit`, payload),
  getMaterialChapterExercises: (id) => api.get(`/student/materis/${id}/chapter-exercises`),
  getMaterialFinalExam: (id) => api.get(`/student/materis/${id}/final-exam`),
  getFinalExam: () => api.get("/student/final-exam"),
  getFinalExamAccess: () => api.get("/student/final-exam/access"),
  getFinalExamDetail: (id) => api.get(`/student/final-exam/${id}`),
  getFinalExamResult: (id) => api.get(`/student/final-exam/${id}/result`),
  submitFinalExam: (id, payload) => api.post(`/student/final-exam/${id}/submit`, payload),
  getGrades: () => api.get("/student/grades"),
  getScores: (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.materi_id) {
      query.set("materi_id", filters.materi_id);
    }
    if (filters.bab_id) {
      query.set("bab_id", filters.bab_id);
    }
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return api.get(`/student/scores${suffix}`);
  },
  getProfile: () => api.get("/student/profile"),
  updateProfile: (payload) => api.put("/student/profile", payload),
  updatePassword: (payload) => api.put("/student/profile/password", payload)
};
export {
  studentService
};
