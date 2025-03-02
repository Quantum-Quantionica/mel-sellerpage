import React, { createContext, useContext, useEffect, useState } from "react";

import ConfigsCache, { SiteConfig } from "./configs/siteConfigs";

interface ConfigContextValue {
  config: SiteConfig|null;
}

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);
export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState(ConfigsCache.getFromCache());

  useEffect(() => {
    ConfigsCache.get().then(config => {
      changeFavicon(config.favicon ?? config.logo);
      setConfig(config);
    });
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
  return context.config!;
};

export default ConfigProvider;

const changeFavicon = (url: string) => {
  const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
  if (link) {
    link.href = url;
  } else {
    const newLink = document.createElement("link");
    newLink.rel = "icon";
    newLink.href = url;
    document.head.appendChild(newLink);
  }
};