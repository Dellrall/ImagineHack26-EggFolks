import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useAllowance() {
  return useQuery({
    queryKey: ['allowance', 'me'],
    queryFn: api.getMyAllowance,
    retry: 2,
  });
}
