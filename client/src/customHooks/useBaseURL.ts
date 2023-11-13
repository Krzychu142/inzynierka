import { useState, useEffect } from "react";

function useBaseURL() {
  const [baseUrl, setBaseUrl] = useState(import.meta.env.VITE_BASE_BACKEND_URL);

  useEffect(() => {
    if (!baseUrl) {
      setBaseUrl("http://localhost:3001/");
    }
  }, [baseUrl]);

  return baseUrl;
}

export default useBaseURL;
