
import AbstractProvider, { ProviderArrayFilters } from "./provider";

interface InfoList {
    title: string;
    items: string[];
}

export interface Product {
    id?: string;
    name: string;
    description: string;
    image?: string;
    images?: string[];
    youtube?: string;
    price: number;
    paymentInfo: string;
    infos: InfoList[];
    reviews: string[];
    tags: string[];
}

export default class ProductsProvider extends AbstractProvider<Product> {
  public collectionName = "products";
  public keys: (keyof Product)[] = [
    "name", "description", "image", "images", "youtube", "price", "paymentInfo", "infos", "reviews", "tags"
  ];
  protected requiredFields: (keyof Product)[] = ["name", "description"];
  protected arrayFieldsFilter: ProviderArrayFilters<Product> = {
    reviews: this.filterStringArrays,
    tags: this.filterStringArrays,
    images: this.filterStringArrays,
  }

  private filterStringArrays(list: string[]) {
    if (!list) return [];
    return list
      .map(item => item.trim())
      .filter(item => item !== "");
  }
}