import defaultLogo from '../images/logo.svg';
import AttendantsProvider, { AttendantSocialLink } from "../data/attendants";

const storage = window.localStorage;

export interface SiteConfig {
  logo: string;
  backgroundColor: string;
  backgroundImage: string;
  headerBackgroundColor: string;
  headerAssentColor: string;
  headerFontColor: string;
  menuAssentColor?: string;
  fotterLogo: string;
  fotterFontColor: string;
  socials: AttendantSocialLink[];
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

  private static EXPIRATION_TIME = 1000 * 60// * 60 * 24; // 24 hours in milliseconds
  private static KEY_EXPIRATION = 'siteConfigExpiration_';
  private static KEY_DATA = 'siteConfig_';
  private static KEY_ID = 'siteConfigDefaultId';
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
    socials: []
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
      attendant.siteConfig.socials = attendant?.socialLinks || [];
      this.saveConfigToCache(id, attendant?.siteConfig);
      return attendant?.siteConfig;
    };

    return {};
  }

  private getConfigId(): string | null {
    const fromUrl = new URLSearchParams(window.location.search).get('site');
    if(fromUrl) {
      storage.setItem(ConfigsCacheProvider.KEY_ID, fromUrl);
    }
    return fromUrl || storage.getItem(ConfigsCacheProvider.KEY_ID);
  }

  private saveConfigToCache(id: string, siteConfig: SiteConfig) {
    storage.setItem(ConfigsCacheProvider.KEY_DATA + id, JSON.stringify(siteConfig));
    storage.setItem(ConfigsCacheProvider.KEY_EXPIRATION + id, new Date().toISOString());
  }

  private getConfigFromCache(id: string | null, force: boolean = false): Partial<SiteConfig> | null {
    if(!id) return null;
    const jsonCache = storage.getItem(ConfigsCacheProvider.KEY_DATA + id);
    if(!jsonCache) return null;

    const createDateString = storage.getItem(ConfigsCacheProvider.KEY_EXPIRATION + id);
    const createDate = createDateString ? new Date(createDateString) : new Date();
    const expirationTime = createDate.getTime() + ConfigsCacheProvider.EXPIRATION_TIME;
    const isCacheValid = expirationTime > new Date().getTime();
    
    if(!isCacheValid && !force) {
      storage.removeItem(ConfigsCacheProvider.KEY_DATA + id);
      console.warn('Cache expired, removing cache for id:', id);
      return null;
    }

    try {
      const cache = JSON.parse(jsonCache) as SiteConfig;
      return cache;
    } catch (error) {
      console.error('Error parsing cache:', error);
    } 

    return null;
  }

}

const ConfigsCache = new ConfigsCacheProvider()
export default ConfigsCache;