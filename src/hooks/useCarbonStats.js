import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useCarbonStats() {
  return useQuery({
    queryKey: ['stats', 'carbon'],
    queryFn: api.getCarbonStats,
    retry: 2,
  });
}
