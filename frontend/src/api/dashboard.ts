import {api} from '@/api/index';
import {DashboardBean} from '@/types/dashboard';

const entryPoint = "/dashboard";

export const DashboardAPI = {
    loadDashboard: async (): Promise<DashboardBean> => {
        const res = await api.get(entryPoint + '/loadDashboard');
        return res.data;
    },
};
