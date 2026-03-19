import { useMemo } from 'react';

export function useSuggestions(query: string, availableNames: string[]) {
  return useMemo(() => {
    if (!query) return [];
    
    const lowerQuery = query.toLowerCase();
    return availableNames.filter(name => 
      name.toLowerCase().includes(lowerQuery)
    );
  }, [query, availableNames]);
}
