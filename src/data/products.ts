
import AbstractProvider, { ProviderArrayFilters } from "./provider";

export interface ProductInfoList {
    title: string;
    items: string[];
}

export type ProductType = 'course' | 'book' | 'appointment';

export interface Product {
    id?: string;
    name: string;
    type?: ProductType;
    description: string;
    image?: string;
    images?: string[];
    youtube?: string;
    paymentInfo: string;
    infos: ProductInfoList[];
    reviews: string[];
    tags: string[];

    price: number;
    purchaseUrl?: string;
  }

export default class ProductsProvider extends AbstractProvider<Product> {
  public collectionName = "products";
  public keys: (keyof Product)[] = [
    "name", "description", "image", "youtube", "price", "paymentInfo", "infos", "reviews", "tags", "purchaseUrl"
  ];
  protected requiredFields: (keyof Product)[] = ["name", "description"];
  protected arrayFieldsFilter: ProviderArrayFilters<Product>

  constructor(private type: ProductType) {
    super();
    this.arrayFieldsFilter =  {
      reviews: this.filterStringArrays,
      tags: this.filterStringArrays,
      infos: this.filterInfo
    }
  }

  private filterInfo = (list?: ProductInfoList[]) => {
    if (!list) return [];
    return list
      .map(item => typeof item === "object" ? item : {} as ProductInfoList)
      .map(item => ({
        title: (item.title || "").trim(),
        items: this.filterStringArrays(item.items)
      })) 
      .filter(item => (item.title.length + item.items.length) !== 0);
  }

  private filterStringArrays(list?: string[]) {
    if (!list) return [];
    return list
      .filter(item => !!item)
      .map(item => (item+"").trim())
      .filter(item => item.length !== 0);
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
    const all = await super.listAll({ type: this.type, ...filter });
    all.forEach(this.fixData)
    return all;
  }

  public async getById(id: string): Promise<Product | null> {
    return super.getById(id)
      .then(this.fixData)
  }
}