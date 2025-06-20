import ProductsProvider, { Product, ProductType } from './products';

export default class CategoryProductsProvider extends ProductsProvider {
  constructor(private category: string, type?: ProductType) {
    super(type);
  }

  listAll(filter: Partial<Product> = {}, orderBy?: keyof Product, limit?: number) {
    return super.listAll({ category: this.category, ...filter }, orderBy, limit);
  }

  countAll(filter: Partial<Product> = {}) {
    return super.countAll({ category: this.category, ...filter });
  }
}
