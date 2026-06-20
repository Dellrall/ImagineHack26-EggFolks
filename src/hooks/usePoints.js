import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function usePoints() {
  return useQuery({
    queryKey: ['points', 'me'],
    queryFn: api.getMyPoints,
    retry: 2,
  });
}
