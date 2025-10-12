"use client"
const { default: axios } = require("axios");
const { useState, useMemo, useEffect } = require("react");

/**
 * Custom React Hook to perform API requests with Axios.
 * Supports GET and POST (or any other method), and allows manual refetching.
 *
 * @param {string} url - The API endpoint.
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.). Default: GET.
 * @param {object} options - Additional axios options (headers, params, data, etc.)
 *
 * @returns {object} - { data, error, loading, refetch }
 */
const useFetch = (url, method = "GET", options = {}) => {
  const [data, setData] = useState(null);       // API response data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null);      // Error message
  const [refreshIndex, setRefreshIndex] = useState(0); // Trigger re-fetch

  // Ensure options remain stable across renders
  const requestOptions = useMemo(() => {
    const opts = { ...options };

    // If it's a POST request without data, ensure a default empty object
    if (method === "POST" && !opts.data) {
      opts.data = {};
    }

    return opts;
  }, [method, JSON.stringify(options)]);

  useEffect(() => {
    const apiCall = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: response } = await axios({
          url,
          method,
          ...requestOptions,
        });

        // Expecting the API to return { success: true/false, message, ... }
        if (response?.success === false) {
          throw new Error(response.message || "Request failed");
        }

        setData(response);
      } catch (error) {
        setError(error?.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    apiCall();
  }, [url, method, requestOptions, refreshIndex]);

  // Manual refetch trigger
  const refetch = () => setRefreshIndex((prev) => prev + 1);

  return { data, error, loading, refetch };
};

export default useFetch;
