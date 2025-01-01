
import AbstractProvider, { ProviderArrayFilters } from "./provider";

interface InfoList {
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
    infos: InfoList[];
    reviews: string[];
    tags: string[];

    price: number;
    purchaseUrl?: string;
  }

export default class ProductsProvider extends AbstractProvider<Product> {
  public collectionName = "products";
  public keys: (keyof Product)[] = [
    "name", "description", "image", "images", "youtube", "price", "paymentInfo", "infos", "reviews", "tags", "purchaseUrl"
  ];
  protected requiredFields: (keyof Product)[] = ["name", "description"];
  protected arrayFieldsFilter: ProviderArrayFilters<Product> = {
    reviews: this.filterStringArrays,
    tags: this.filterStringArrays,
    images: this.filterStringArrays,
  }

  constructor(
    private type: ProductType
  ) {
    super();
  }

  private filterStringArrays(list: string[]) {
    if (!list) return [];
    return list
      .filter(item => !!item)
      .map(item => item.trim())
      .filter(item => item !== "");
  }

  protected filterData(item: Partial<Product>) {
    item.type = this.type
    return super.filterData(item);
  }

  public async listAll(filter?: Partial<Product>): Promise<Product[]> {
    return super.listAll({ type: this.type, ...filter });
  }
}