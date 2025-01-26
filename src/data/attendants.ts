import { SiteConfig } from "../configs/siteConfigs";
import AbstractProvider, { ProviderArrayFilters } from "./provider";

export interface Attendant {
  id?: string;
  domains?: string[];
  name: string;
  brand: string;
  title?: string;
  slogan?: string;
  photo?: string;
  history?: string;
  formation?: string;
  registration: string;
  socialLinks?: AttendantSocialLink[];
  organizationalCulture?: AttendantOrganizationalCulture;
  siteConfig?: SiteConfig;
}

export interface AttendantOrganizationalCulture {
  mission?: string;
  vision?: string;
  values?: string;
}

export interface AttendantSocialLink {
  link: string;
  icon: string;
  name: string;
}

export default class AttendantsProvider extends AbstractProvider<Attendant> {
  public collectionName: string = "attendants";
  public keys: (keyof Attendant)[] = [
    "domains", "name", "brand", "title", "slogan", "registration", "photo", "history", "formation", "socialLinks", "organizationalCulture", "siteConfig"
  ];
  protected arrayFieldsFilter: ProviderArrayFilters<Attendant> = {
    socialLinks: this.filterObjectArrays,
  };
  protected requiredFields: (keyof Attendant)[] = ["name", "brand"];

  private filterObjectArrays(list?: any[]) {
    if (!list) return [];
    return list.filter(item => typeof item === "object")
  }
}