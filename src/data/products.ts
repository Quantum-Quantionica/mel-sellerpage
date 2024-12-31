
import AbstractProvider from "./provider";

interface InfoList {
    title: string;
    items: string[];
}

export interface Product {
    id?: string;
    name: string;
    description: string;
    images?: string[];
    youtube?: string;
    price: number;
    paymentInfo: string;
    infos: InfoList[];
    reviews: string[];
}

export default class ProductsProvider extends AbstractProvider<Product> {
  public collectionName = "products";
  public keys: (keyof Product)[] = [
    "name", "description", "images", "youtube", "price", "paymentInfo", "infos", "reviews"
  ];
  
}