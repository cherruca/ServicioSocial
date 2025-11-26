import { useState, useCallback } from 'react';
import axiosInstance from '../util/axiosInstance';

export const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const responseOrData = await apiFunc(axiosInstance, ...args);
        // Support two service shapes:
        // 1) service returns an Axios response -> { data: ... }
        // 2) service returns the already-extracted data
        const payload =
          responseOrData && responseOrData.data !== undefined
            ? responseOrData.data
            : responseOrData;
        setData(payload);
        return { ok: true, data: payload };
      } catch (err) {
        setError(err);
        return { ok: false, error: err };
      } finally {
        setLoading(false);
      }
    },
    [apiFunc] // Asegúrate de que solo dependes de `apiFunc`
  );

  return { data, loading, error, execute };
};
