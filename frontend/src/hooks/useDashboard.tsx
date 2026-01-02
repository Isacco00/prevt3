import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { DashboardAPI } from '@/api/dashboard';
import { DashboardBean } from '@/types/dashboard';

interface UseDashboardType {
    loadDashboard: (enabled: boolean) => UseQueryResult<DashboardBean>;
}

export const useDashboard = (): UseDashboardType => {

    const loadDashboard = (enabled: boolean) =>
        useQuery<DashboardBean>({
            queryKey: ['dashboard'],
            queryFn: DashboardAPI.loadDashboard,
            enabled,
            staleTime: 60_000,
        });

    return {
        loadDashboard,
    };
};
