import { IconDefinition, IconKey, Icons } from '../../components/Icons';
import AttendantsProvider, { Attendant, AttendantSocialLink } from "../data/attendants";

export const isDev = window.location.hostname === 'localhost';
export const configStorage = isDev ? window.sessionStorage : window.localStorage;
export const isAdmin = configStorage.getItem('admin') === 'true';

export interface SiteConfig {
  logo?: string;
  favicon?: string;
  backgroundColor: string;
  backgroundImage: string;
  headerBackgroundColor: string;
  headerAssentColor: string;
  headerFontColor: string;
  menuAssentColor?: string;
  markColor: string;
  markIcon: IconKey | IconDefinition,
  fotterLogo?: string;
  fotterFontColor: string;
  socials: AttendantSocialLink[];
  whatsappNumber?: string;
  whatsappLink?: string;
  carrosel?: string[];
}

export const ConfigKeys: (keyof SiteConfig)[] = [
  "backgroundColor",
  "headerBackgroundColor",
  "headerAssentColor",
  "headerFontColor",
  "menuAssentColor",
  "fotterFontColor",
  "markColor",
  "markIcon",
  "whatsappNumber",
  "carrosel",
]

class ConfigsCacheProvider {

  private static EXPIRATION_TIME = 1000 * ((isDev || isAdmin) ? 60 : 60 * 60 * 24); // ? 1min : 24 hours in milliseconds
  private static KEY_EXPIRATION = 'siteConfigExpiration_';
  private static KEY_DATA = 'siteAttendantData_v2_';
  private static KEY_ID = 'siteConfigDefaultId';
  private lastRequestPromise: Promise<any> | null = null;

  private attendantProvider = new AttendantsProvider();

  private defaultConfig: SiteConfig = {
    backgroundColor: '#fff',
    backgroundImage: "",
    headerBackgroundColor: '#fff',
    headerAssentColor: 'orange',
    headerFontColor: '#000',
    fotterFontColor: '#000',
    markColor: 'orange',
    markIcon: Icons.solid.faQuoteLeft,
    socials: []
  }

  constructor() {
    this.get();
  }

  public async get(): Promise<SiteConfig> {
    if(this.lastRequestPromise) {
      console.log('Waiting for last request to finish');
      await this.lastRequestPromise;
    }
    const configRequest = this.lastRequestPromise = this.getAttendant();
    const config = await configRequest;
    return {
      ...this.defaultConfig,
      ...config.siteConfig,
      whatsappLink: `https://wa.me/${config.siteConfig?.whatsappNumber?.replace(/\D/g, '')}`
    };
  }

  public getFromCache(): SiteConfig|null {
    const id = this.getCachedAttendantId();
    if(!id) return null;
    return {
      ...this.defaultConfig,
      ...this.getAttendantFromCache(id, true)?.siteConfig || {}
    };
  }

  public async getAttendant(): Promise<Partial<Attendant>> {
    const attendant = await this._getAttendant();
    document.title = attendant?.brand || 'Seller Page';
    return attendant;
  }

  private async _getAttendant(): Promise<Partial<Attendant>> {
    const id = await this.getAttendantId()
    if(!id) return {}

    const cache = this.getAttendantFromCache(id);
    if(cache) {
      console.log('Getting config from cache for id:', id, cache);
      return cache;
    };

    const attendant = await this.attendantProvider.getById(id)
    if(!attendant) {
      console.warn('Attendant not found for id:', id, ', removing cached id');
      configStorage.removeItem(ConfigsCacheProvider.KEY_ID);
      return {};
    };
    console.log('Getting config from database for id:', id, attendant?.siteConfig);
    if(attendant?.siteConfig) {
      attendant.siteConfig.socials = attendant?.socialLinks || [];
      this.saveAttendantToCache(attendant);
      return attendant;
    };

    return {};
  }

  private async getAttendantId(): Promise<string | null> {
    const id = this.getCachedAttendantId();
    if(id) return id;

    const attendant = await this.attendantProvider.getOne({ domains: [window.location.hostname] });
    if(attendant) {
      this.saveAttendantToCache(attendant);
      if (attendant.id) {
        configStorage.setItem(ConfigsCacheProvider.KEY_ID, attendant.id);
        return attendant.id;
      }
    }
    console.log('Attendant not found for domain:', window.location.hostname);
    return null;
  }

  public getCachedAttendantId(): string | null {
    const fromUrl = new URLSearchParams(window.location.search).get('site');
    if(fromUrl) {
      configStorage.setItem(ConfigsCacheProvider.KEY_ID, fromUrl);
    }
    return fromUrl || configStorage.getItem(ConfigsCacheProvider.KEY_ID);
  }

  private saveAttendantToCache(attendant: Attendant) {
    configStorage.setItem(ConfigsCacheProvider.KEY_DATA + attendant.id, JSON.stringify(attendant));
    configStorage.setItem(ConfigsCacheProvider.KEY_EXPIRATION + attendant.id, new Date().toISOString());
  }

  private getAttendantFromCache(id: string | null, force: boolean = false): Partial<Attendant> | null {
    if(!id) return null;
    const jsonCache = configStorage.getItem(ConfigsCacheProvider.KEY_DATA + id);
    if(!jsonCache) return null;

    const createDateString = configStorage.getItem(ConfigsCacheProvider.KEY_EXPIRATION + id);
    const createDate = createDateString ? new Date(createDateString) : new Date();
    const expirationTime = createDate.getTime() + ConfigsCacheProvider.EXPIRATION_TIME;
    const isCacheValid = expirationTime > new Date().getTime();
    
    if(!isCacheValid && !force) {
      configStorage.removeItem(ConfigsCacheProvider.KEY_DATA + id);
      console.warn('Cache expired, removing cache for id:', id);
      return null;
    }

    try {
      const cache = JSON.parse(jsonCache) as Attendant;
      return cache;
    } catch (error) {
      console.error('Error parsing cache:', error);
    } 

    return null;
  }
}

const ConfigsCache = new ConfigsCacheProvider()
export default ConfigsCache;