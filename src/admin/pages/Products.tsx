import { Link, useParams } from "react-router-dom";

import ProductsProvider, { Product } from "../../data/products";
import DynamicForm, { ListRenderer, ListRendererConfigs, TextArea } from "../../components/forms/Forms";
import ImageRenderer from "../../components/forms/ImageRenderer";
import DynamicList from "../../components/forms/List";
import { deleteFolder } from "../../configs/firebase";

const productsProvider = new ProductsProvider();
const newUrl = 'new';
const ProductsPage = () => {
  const { id } = useParams<{ id: string }>();  

  if(!id)
    return <>
      <Link to={newUrl}>Add Product</Link>
      <DynamicList provider={productsProvider} title="Products" nameKey="name" deleteInterceptor={async item => {
        await deleteFolder(`${productsProvider.collectionName}/${item.id}`);
        return true;
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
        images: ListRenderer,
        tags: ListRenderer,
        reviews: ListRenderer,
      }}
      fieldConfigs={{
        reviews: {
          renderer: TextArea,
        } as ListRendererConfigs<Product>,
        images: {
          renderer: ImageRenderer,
        } as ListRendererConfigs<Product>,
      }}
    />
  );
};
  
export default ProductsPage;