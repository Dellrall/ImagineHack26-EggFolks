import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useSchedule() {
  return useQuery({
    queryKey: ['schedule', 'me'],
    queryFn: api.getMySchedule,
    retry: 2,
  });
}
