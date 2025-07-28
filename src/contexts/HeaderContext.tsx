import { createContext, useContext, useState, ReactNode } from 'react';

interface HeaderInfo {
  title: string;
  description?: string;
  badge?: ReactNode;
  extra?: ReactNode;
}

interface HeaderContextType {
  headerInfo: HeaderInfo | null;
  setHeaderInfo: (info: HeaderInfo | null) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [headerInfo, setHeaderInfo] = useState<HeaderInfo | null>(null);

  return (
    <HeaderContext.Provider value={{ headerInfo, setHeaderInfo }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
};