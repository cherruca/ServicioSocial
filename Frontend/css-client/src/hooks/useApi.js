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
                const response = await apiFunc(axiosInstance, ...args);
                setData(response.data);
                return { ok: true, data: response.data };
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
