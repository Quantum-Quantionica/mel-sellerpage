import { IconDefinition, IconKey, Icons } from '../components/Icons';
import AttendantsProvider, { Attendant, AttendantSocialLink } from "../data/attendants";
import defaultLogo from '../images/logo.svg';

const isDev = window.location.host === 'localhost';
const storage = isDev ? window.sessionStorage : window.localStorage;

export interface SiteConfig {
  logo: string;
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

  private static EXPIRATION_TIME = 1000 * (isDev ? 60 : 60 * 60 * 24); // ? 1min : 24 hours in milliseconds
  private static KEY_EXPIRATION = 'siteConfigExpiration_';
  private static KEY_DATA = 'siteAttendantData_v2_';
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
      storage.removeItem(ConfigsCacheProvider.KEY_ID);
      return {};
    };
    console.log('Getting config from database for id:', id, attendant?.siteConfig);
    if(attendant?.siteConfig) {
      console.log("Socials Configs Copy, As:", attendant?.socialLinks, "a:", attendant);
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
        storage.setItem(ConfigsCacheProvider.KEY_ID, attendant.id);
        return attendant.id;
      }
    }
    console.log('Attendant not found for domain:', window.location.hostname);
    return null;
  }

  public getCachedAttendantId(): string | null {
    const fromUrl = new URLSearchParams(window.location.search).get('site');
    if(fromUrl) {
      storage.setItem(ConfigsCacheProvider.KEY_ID, fromUrl);
    }
    return fromUrl || storage.getItem(ConfigsCacheProvider.KEY_ID);
  }

  private saveAttendantToCache(attendant: Attendant) {
    storage.setItem(ConfigsCacheProvider.KEY_DATA + attendant.id, JSON.stringify(attendant));
    storage.setItem(ConfigsCacheProvider.KEY_EXPIRATION + attendant.id, new Date().toISOString());
  }

  private getAttendantFromCache(id: string | null, force: boolean = false): Partial<Attendant> | null {
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