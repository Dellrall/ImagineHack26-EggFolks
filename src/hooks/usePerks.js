import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function usePerks() {
  const perks = useQuery({
    queryKey: ['perks'],
    queryFn: api.getPerks,
    retry: 2,
  });

  const claim = useMutation({
    mutationFn: api.postClaimPerk,
    retry: 1,
  });

  return { perks, claim };
}
