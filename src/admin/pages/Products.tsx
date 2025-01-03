import { Link, useParams } from "react-router-dom";

import ProductsProvider, { Product } from "../../data/products";
import { DynamicForm, InfoRenderer, ListRenderer, ListRendererConfigs, TextArea } from "../../components/forms";
import ImageRenderer from "../../components/forms/ImageRenderer";
import DynamicList from "../../components/forms/List";
import { deleteFolder } from "../../configs/firebase";

const newUrl = 'new';

interface ProductsPageProps {
  provider: ProductsProvider;
  title: string;
  name: string;
}
const ProductsPage = ({provider, title, name}: ProductsPageProps) => {
  const { id } = useParams<{ id: string }>();  

  if(!id)
    return <>
      <Link to={newUrl}>Add {name}</Link>
      <DynamicList provider={provider} title={name} nameKey="name" deleteInterceptor={async item => {
        await deleteFolder(`${provider.collectionName}/${item.id}`);
        return true;
      }} />
    </>;

  return (
    <DynamicForm<Product>
      title={title}
      id={id === newUrl ? undefined : id}
      provider={provider}
      fieldRenderers={{
        description: TextArea,
        image: ImageRenderer,
        images: ListRenderer,
        tags: ListRenderer,
        reviews: ListRenderer,
        infos: ListRenderer,
      }}
      fieldConfigs={{
        images: {
          renderer: ImageRenderer,
        } as ListRendererConfigs<Product>,
        reviews: {
          renderer: TextArea,
        } as ListRendererConfigs<Product>,
        infos: {
          renderer: InfoRenderer,
        } as ListRendererConfigs<Product>,
      }}
    />
  );
};
  
export default ProductsPage;