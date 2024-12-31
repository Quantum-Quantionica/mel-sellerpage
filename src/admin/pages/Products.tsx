import { Link, useParams } from "react-router-dom";

import ProductsProvider, { Product } from "../../data/products";
import DynamicForm, { ListRenderer, TextArea } from "../../components/forms/Forms";
import ImageRenderer, { deleteImage } from "../../components/forms/ImageRenderer";
import DynamicList from "../../components/forms/List";

const productsProvider = new ProductsProvider();
const newUrl = 'new';
const ProductsPage = () => {
  const { id } = useParams<{ id: string }>();  

  if(!id)
    return <>
      <Link to={newUrl}>Add Product</Link>
      <DynamicList provider={productsProvider} title="Products" nameKey="name" deleteInterceptor={async item => {
        if(!item.image) return true;
        return await deleteImage(item, "image", productsProvider);
      }} />
    </>;

  return (
    <DynamicForm<Product>
      title="Product Form"
      id={id === newUrl ? undefined : id}
      provider={productsProvider}
      fieldRenderers={{
        description: TextArea,
        image: ImageRenderer,
        tags: ListRenderer,
        reviews: ListRenderer,
      }}
    />
  );
};
  
export default ProductsPage;