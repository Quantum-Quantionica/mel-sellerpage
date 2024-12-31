import { Link, useParams } from "react-router-dom";

import ProductsProvider, { Product } from "../../data/products";
import DynamicForm, { TextArea } from "../../components/forms/Forms";
import ImageRenderer from "../../components/forms/ImageRenderer";
import DynamicList from "../../components/forms/List";

const productsProvider = new ProductsProvider();
const newUrl = 'new';
const ProductsPage = () => {
  const { id } = useParams<{ id: string }>();  

  if(!id)
    return <>
      <Link to={newUrl}>Add Product</Link>
      <DynamicList provider={productsProvider} title="Products" nameKey="name" />
    </>;

  return (
    <DynamicForm<Product>
      title="Product Form"
      id={id === newUrl ? undefined : id}
      provider={productsProvider}
      fieldRenderers={{
        description: TextArea,
        images: ImageRenderer,
      }}
    />
  );
};
  
export default ProductsPage;