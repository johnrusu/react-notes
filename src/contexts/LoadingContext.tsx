import { useState } from "react";
import type { ReactNode } from "react";
import { LoadingContext } from "./LoadingContext.hooks";

const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
