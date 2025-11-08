import { useCallback, useRef } from "react";
import api from "@/api";

type CacheValue = {
  data: any;
  timestamp: number;
};

export const useCachedApi = () => {
  const cache = useRef<Map<string, CacheValue>>(new Map());

  const cachedRequest = useCallback(
    async <T>(
      url: string,
      options: any = {},
      ttl = 30000 // 30 seconds
    ): Promise<T> => {
      const cacheKey = `${url}-${JSON.stringify(options)}`;
      const cached = cache.current.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data as T;
      }

      // ✅ typed Axios call
      const response = await api<T>({
        url,
        ...options,
      });

      cache.current.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });

      return response.data;
    },
    []
  );

  const clearCache = useCallback((key?: string) => {
    if (key) {
      cache.current.delete(key);
    } else {
      cache.current.clear();
    }
  }, []);

  return { cachedRequest, clearCache };
};
