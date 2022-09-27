import { useLocation } from 'react-router-dom';

export function useQuery(selector: string) {
  const location = useLocation();
  return decodeURIComponent(new URLSearchParams(location.search).get(selector) || '');
}
