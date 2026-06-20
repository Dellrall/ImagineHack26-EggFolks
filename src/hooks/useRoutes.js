import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useRoutes(preference = 'eco') {
  const recommended = useQuery({
    queryKey: ['routes', 'recommend', preference],
    queryFn: api.getRecommendedRoute,
    retry: 2,
  });

  const history = useQuery({
    queryKey: ['routes', 'history'],
    queryFn: api.getRouteHistory,
    retry: 2,
  });

  const feedback = useMutation({
    mutationFn: api.postRouteFeedback,
    retry: 1,
  });

  return { recommended, history, feedback };
}
