import defaultLogo from '../images/logo.svg';
import AttendantsProvider from "../data/attendants";

const storage = window.sessionStorage;

export interface SiteConfig {
  logo: string;
  backgroundColor: string;
  backgroundImage: string;
  headerBackgroundColor: string;
  headerAssentColor: string;
  headerFontColor: string;
  menuAssentColor?: string;
  fotterFontColor: string;
}

export const ConfigKeys: (keyof SiteConfig)[] = [
  "backgroundColor",
  "headerBackgroundColor",
  "headerAssentColor",
  "headerFontColor",
  "menuAssentColor",
  "fotterFontColor"
]

class ConfigsCacheProvider {

  private static KEY = 'siteConfig_';
  private static KEY_EXPIRATION = 'siteConfigExpiration_';
  private static EXPIRATION_TIME = 1000 * 60// * 60 * 24; // 24 hours in milliseconds
  private lastRequestPromise: Promise<any> | null = null;

  private attendantProvider = new AttendantsProvider();

  private defaultConfig: SiteConfig = {
    logo: defaultLogo,
    backgroundColor: '#fff',
    backgroundImage: "",
    headerBackgroundColor: '#fff',
    headerAssentColor: 'orange',
    headerFontColor: '#000',
    fotterFontColor: '#000',
  }

  public async get(): Promise<SiteConfig> {
    if(this.lastRequestPromise) {
      await this.lastRequestPromise;
    }
    const config = this.lastRequestPromise = this.getConfig();
    return {
      ...this.defaultConfig,
      ...await config
    };
  }

  public getFromCache(): SiteConfig {
    return {
      ...this.defaultConfig,
      ...this.getConfigFromCache(this.getConfigId(), true) || {}
    };
  }

  private async getConfig(): Promise<Partial<SiteConfig>> {
    const id = this.getConfigId()
    if(!id) return {}

    const cache = this.getConfigFromCache(id);
    if(cache) {
      return cache;
    };

    const attendant = await this.attendantProvider.getById(id)
    console.log('Getting config from database for id:', id, attendant?.siteConfig);
    if(attendant?.siteConfig) {
      this.saveConfigToCache(id, attendant?.siteConfig);
      return attendant?.siteConfig;
    };

    return {};
  }

  private getConfigId(): string | undefined {
    return new URLSearchParams(window.location.search).get('site') || undefined;
  }

  private saveConfigToCache(id: string, siteConfig: SiteConfig) {
    storage.setItem(ConfigsCacheProvider.KEY + id, JSON.stringify(siteConfig));
    storage.setItem(ConfigsCacheProvider.KEY_EXPIRATION + id, new Date().toISOString());
  }

  private getConfigFromCache(id?: string, force: boolean = false): Partial<SiteConfig> | null {
    if(!id) return null;
    const jsonCache = storage.getItem(ConfigsCacheProvider.KEY + id);
    if(!jsonCache) return null;

    const createDateString = storage.getItem(ConfigsCacheProvider.KEY_EXPIRATION + id);
    const createDate = createDateString ? new Date(createDateString) : new Date();
    const expirationTime = createDate.getTime() + ConfigsCacheProvider.EXPIRATION_TIME;
    const isCacheValid = expirationTime > new Date().getTime();
    
    if(!isCacheValid && !force) {
      storage.removeItem(ConfigsCacheProvider.KEY + id);
      console.warn('Cache expired, removing cache for id:', id);
      return null;
    }

    try {
      const cache = JSON.parse(jsonCache);
      console.log('Getting config from cache for id:', id, 'forced:', force, cache);
      return cache;
    } catch (error) {
      console.error('Error parsing cache:', error);
    } 

    return null;
  }

}

const ConfigsCache = new ConfigsCacheProvider()
export default ConfigsCache;