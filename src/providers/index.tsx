"use client";

import React, { useEffect, useState } from "react";

import { SocketProvider } from "./SocketProvider";

export const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <SocketProvider>{children}</SocketProvider>;
};
