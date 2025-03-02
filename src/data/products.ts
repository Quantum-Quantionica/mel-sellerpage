
import ConfigsCache, { configStorage } from "../configs/siteConfigs";
import AbstractProvider from "./provider";

export interface ProductInfoList {
    title: string;
    items?: string[];
}

export type ProductType = 'course' | 'book' | 'appointment';

export interface Product {
    id?: string;
    attendants?: string[];
    name?: string;
    type?: ProductType;
    category?: string;
    description?: string;
    image?: string;
    images?: string[];
    youtube?: string;
    paymentInfo: string;
    infos?: ProductInfoList[];
    reviews?: string[];
    tags?: string[];

    price?: number;
    purchaseUrl?: string;
  }

export default class ProductsProvider extends AbstractProvider<Product> {
  public collectionName = "products";
  public keys: (keyof Product)[] = [
    "attendants", "category", "name", "description", "image", "youtube", "price", "paymentInfo", "infos", "reviews", "tags", "purchaseUrl"
  ];
  protected requiredFields: (keyof Product)[] = ["name", "description"];
  private fullName: string;
  
  constructor(private type: ProductType) {
    super();
    this.fullName = this.collectionName + this.type;
  }

  private addAttendantIfNeeded(item: Partial<Product>) {
    const attendent = ConfigsCache.getCachedAttendantId();
    item.attendants = item.attendants ?? [];
    if (attendent && item.attendants.length === 0) {
      item.attendants.push(attendent);
    }
  }

  protected validateData(item: Partial<Product>): void {
    this.addAttendantIfNeeded(item);
    super.validateData(item);
  }

  protected filterData(item: Partial<Product>) {
    item.type = this.type
    return super.filterData(item);
  }

  private getMergedFilter(filter?: Partial<Product>): Partial<Product> {
    const attendent = ConfigsCache.getCachedAttendantId();
    const attendentFilter = attendent ? { attendants: [attendent] } : {};
    return { type: this.type, ...attendentFilter, ...filter };
  }

  public async listAll(filter?: Partial<Product>): Promise<Product[]> {
    const mergedFilter = this.getMergedFilter(filter);
    const all = await super.listAll(mergedFilter);

    if(all.length === 0)
      configStorage.removeItem(this.fullName);
    else 
      configStorage.setItem(this.fullName, "true");
    return all;
  }

  public async getById(id: string): Promise<Product | null> {
    const cache = this.lastResult?.find(item => item.id === id);

    return cache ? cache : await super.getById(id)
  }

  public hasItems(): boolean {
    return configStorage.getItem(this.fullName) === "true";
  }
}