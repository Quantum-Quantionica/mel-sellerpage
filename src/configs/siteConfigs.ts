import defaultLogo from '../images/logo.svg';
import AttendantsProvider, { AttendantSocialLink, Attendant } from "../data/attendants";
import { IconDefinition, IconKey, Icons } from '../components/Icons';

const storage = window.localStorage;

export interface SiteConfig {
  logo: string;
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
]

const NiltonId = "SLjaGEkE0VCBplQuu5Za";
const MelissaId = "aooSjbBQ5VXrwm9g9X55";
const DomainsIds: { [key: string]: string } = {
  "sellerpage.web.app": NiltonId,
  "tom.quantionsconsciencial.com.br": NiltonId,
  "ton.quantionsconsciencial.com.br": NiltonId,
  "tomsilvva.quantionsconsciencial.com.br": NiltonId,
  "tomsilva.quantionsconsciencial.com.br": NiltonId,
  "tonsilva.quantionsconsciencial.com.br": NiltonId,
  "tonsilvva.quantionsconsciencial.com.br": NiltonId,
  
  "sellerpage.firebaseapp.com": MelissaId,
  "melissamaria.quantionsconsciencial.com.br": MelissaId,
  "melisamaria.quantionsconsciencial.com.br": MelissaId,
  "melissa.quantionsconsciencial.com.br": MelissaId,
  "melisa.quantionsconsciencial.com.br": MelissaId,
}

class ConfigsCacheProvider {

  private static EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 hours in milliseconds
  private static KEY_EXPIRATION = 'siteConfigExpiration_';
  private static KEY_DATA = 'siteAttendantData_';
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

  public async get(): Promise<SiteConfig> {
    if(this.lastRequestPromise) {
      await this.lastRequestPromise;
    }
    const configRequest = this.lastRequestPromise = this.getAttendant();
    const config = await configRequest;
    return {
      ...this.defaultConfig,
      ...config.siteConfig,
      whatsappLink: `https://wa.me/${config.whatsappNumber?.replace(/\D/g, '')}`
    };
  }

  public getFromCache(): SiteConfig {
    return {
      ...this.defaultConfig,
      ...this.getAttendantFromCache(this.getAttendantId(), true)?.siteConfig || {}
    };
  }

  public async getAttendant(): Promise<Partial<Attendant>> {
    const attendant = await this._getAttendant();
    document.title = attendant?.brand || 'Seller Page';
    return attendant;
  }

  private async _getAttendant(): Promise<Partial<Attendant>> {
    const id = this.getAttendantId()
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
      attendant.siteConfig.socials = attendant?.socialLinks || [];
      this.saveAttendantToCache(id, attendant);
      return attendant;
    };

    return {};
  }

  private getAttendantId(): string | null {
    const fromUrl = new URLSearchParams(window.location.search).get('site');
    if(fromUrl) {
      storage.setItem(ConfigsCacheProvider.KEY_ID, fromUrl);
    }
    return fromUrl || storage.getItem(ConfigsCacheProvider.KEY_ID) || DomainsIds[window.location.hostname];
  }

  private saveAttendantToCache(id: string, siteConfig: Attendant) {
    storage.setItem(ConfigsCacheProvider.KEY_DATA + id, JSON.stringify(siteConfig));
    storage.setItem(ConfigsCacheProvider.KEY_EXPIRATION + id, new Date().toISOString());
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