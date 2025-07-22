import React, { createContext, useContext } from 'react';
import { useLogin } from '@/hooks/useLogin';
import {useUserStore} from '@/stores/userStore'
const authContext = createContext<ReturnType<typeof useLogin> | null>(null);

export const AuthProvider  = ({ role, children }: { role: 'owner' | 'employee'; children: React.ReactNode }) => {
  const login = useLogin(role);


  console.log('User stored in Zustand:', useUserStore.getState().user);

  return <authContext.Provider value={login}>{children}</authContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(authContext);
  if (!ctx) throw new Error('useLoginContext must be used within a LoginProvider');
  return ctx;
};
