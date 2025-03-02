
import ConfigsCache from "../configs/siteConfigs";
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
  
  constructor(private type: ProductType) {
    super();
  }

  private fixData(item: Product | null): Product | null {
    if(item && Array.isArray(item.infos)) {
      item.infos = item.infos.map(info => 
        typeof info === "string" ? {title: info, items: [] } : info
      )
    }
    return item;
  }

  protected filterData(item: Partial<Product>) {
    item.type = this.type
    return super.filterData(item);
  }

  public async listAll(filter?: Partial<Product>): Promise<Product[]> {
    const attendent = ConfigsCache.getCachedAttendantId();
    const attendentFilter = attendent ? { attendants: [attendent] } : {};
    const all = await super.listAll({ type: this.type, ...attendentFilter, ...filter });
    all.forEach(this.fixData)
    return all;
  }

  public async getById(id: string): Promise<Product | null> {
    return super.getById(id)
      .then(this.fixData)
  }
}