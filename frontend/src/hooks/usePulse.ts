import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import type { PulseData } from '@/types/api.types';
import { PULSE_INTERVAL } from '@/utils/constants';

export const usePulse = () => {
  const [pulse, setPulse] = useState<PulseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPulse = useCallback(async () => {
    try {
      const response = await api.getPulse();
      if (response.success && response.data) {
        setPulse(response.data);
        setError(null);
      } else {
        setError(response.error || 'Failed to fetch pulse');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pulse');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch immediately
    fetchPulse();

    // Setup interval to fetch pulse data
    const interval = setInterval(fetchPulse, PULSE_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchPulse]);

  return {
    pulse,
    isLoading,
    error,
    refetch: fetchPulse,
  };
};
