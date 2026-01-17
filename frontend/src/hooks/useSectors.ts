import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import type { Sector } from '@/types/sector.types';

export const useSectors = () => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSectors = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.getSectors();
      
      if (response.success && response.data) {
        setSectors(response.data);
        setError(null);
      } else {
        setError(response.error || 'Failed to fetch sectors');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sectors');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSectors();
  }, [fetchSectors]);

  const subscribeSector = async (id: string): Promise<boolean> => {
    try {
      const response = await api.subscribeSector(id);
      return response.success;
    } catch (err) {
      return false;
    }
  };

  return {
    sectors,
    isLoading,
    error,
    refetch: fetchSectors,
    subscribeSector,
  };
};
