import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useTardinessStats() {
  return useQuery({
    queryKey: ['stats', 'tardiness'],
    queryFn: api.getTardinessStats,
    retry: 2,
  });
}
