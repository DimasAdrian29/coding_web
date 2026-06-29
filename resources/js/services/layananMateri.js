import axios from 'axios';

const layananMateri = {
    async getMaterials() {
        const { data } = await axios.get('/api/materials');
        return data.materials ?? [];
    },

    async createMaterial(payload) {
        const { data } = await axios.post('/api/materials', payload);
        return data;
    },

    async updateMaterial(id, payload) {
        const { data } = await axios.put(`/api/materials/${id}`, payload);
        return data;
    },

    async deleteMaterial(id) {
        const { data } = await axios.delete(`/api/materials/${id}`);
        return data;
    },

    async createChapter(materialId, payload) {
        const { data } = await axios.post(`/api/materials/${materialId}/chapters`, payload);
        return data;
    },

    async updateChapter(id, payload) {
        const { data } = await axios.put(`/api/chapters/${id}`, payload);
        return data;
    },

    async deleteChapter(id) {
        const { data } = await axios.delete(`/api/chapters/${id}`);
        return data;
    },

    async createExercise(chapterId, payload) {
        const { data } = await axios.post(`/api/chapters/${chapterId}/exercises`, payload);
        return data;
    },

    async updateExercise(id, payload) {
        const { data } = await axios.put(`/api/exercises/${id}`, payload);
        return data;
    },

    async deleteExercise(id) {
        const { data } = await axios.delete(`/api/exercises/${id}`);
        return data;
    },

    async createQuiz(materialId, payload) {
        const { data } = await axios.post(`/api/materials/${materialId}/quiz`, payload);
        return data;
    },

    async updateQuiz(id, payload) {
        const { data } = await axios.put(`/api/quizzes/${id}`, payload);
        return data;
    },

    async deleteQuiz(id) {
        const { data } = await axios.delete(`/api/quizzes/${id}`);
        return data;
    },

    async createQuizQuestion(quizId, payload) {
        const { data } = await axios.post(`/api/quizzes/${quizId}/questions`, payload);
        return data;
    },

    async updateQuizQuestion(id, payload) {
        const { data } = await axios.put(`/api/quiz-questions/${id}`, payload);
        return data;
    },

    async deleteQuizQuestion(id) {
        const { data } = await axios.delete(`/api/quiz-questions/${id}`);
        return data;
    },

    async getStudentMaterials() {
        const { data } = await axios.get('/api/student/materials');
        return data.materials ?? [];
    },

    async getStudentMaterial(id) {
        const { data } = await axios.get(`/api/student/materials/${id}`);
        return data.material ?? null;
    },

    async startStudentMaterial(id) {
        const { data } = await axios.post(`/api/student/materials/${id}/start`);
        return data;
    },
};

export default layananMateri;
