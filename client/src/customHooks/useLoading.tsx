import { useState } from "react";
import LoadingSpinner from "../components/loading/LoadingSpinner";

export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  const RenderSpinner = () => {
    if (!isLoading) return null;
    return <LoadingSpinner />;
  };

  return { startLoading, stopLoading, RenderSpinner };
};
