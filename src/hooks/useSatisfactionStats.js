import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useSatisfactionStats() {
  return useQuery({
    queryKey: ['stats', 'satisfaction'],
    queryFn: api.getSatisfactionStats,
    retry: 2,
  });
}
