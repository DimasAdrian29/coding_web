import axios from 'axios';

const layananStatistik = {
    async getTeacherStatistics() {
        const { data } = await axios.get('/api/guru/statistics');
        return data;
    },
};

export default layananStatistik;
