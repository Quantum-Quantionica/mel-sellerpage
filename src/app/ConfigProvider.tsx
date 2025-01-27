import React, { createContext, useContext, useEffect, useState } from "react";

import ConfigsCache, { SiteConfig } from "../configs/siteConfigs";

interface ConfigContextValue {
  config: SiteConfig|null;
}

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);
export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState(ConfigsCache.getFromCache());

  useEffect(() => {
    ConfigsCache.get().then(setConfig);
  }, []);

  return <ConfigContext.Provider value={{ config }}>
    {children}
  </ConfigContext.Provider>
};

export const useConfigs = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context.config;
};

export default ConfigProvider;