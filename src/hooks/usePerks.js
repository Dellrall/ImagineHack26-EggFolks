import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function usePerks() {
  const queryClient = useQueryClient();

  const perks = useQuery({
    queryKey: ['perks'],
    queryFn: api.getPerks,
    retry: 2,
  });

  const claim = useMutation({
    mutationFn: api.postClaimPerk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['points'] });
      queryClient.invalidateQueries({ queryKey: ['claimedPerks'] });
      queryClient.invalidateQueries({ queryKey: ['perks'] });
    },
    retry: 1,
  });

  return { perks, claim };
}

export function useClaimedPerks() {
  return useQuery({
    queryKey: ['claimedPerks'],
    queryFn: api.getClaimedPerks,
    retry: 2,
  });
}
