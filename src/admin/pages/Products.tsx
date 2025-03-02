import { Link, useParams } from "react-router-dom";

import { deleteFolder } from "../../configs/firebase";
import ProductsProvider, { Product } from "../../data/products";

import { DynamicForm, ImageRenderer, InfoRenderer, ListRenderer, ListRendererConfigs, TextArea } from "../../components/forms";
import DynamicList from "../../components/forms/List";
import Icon, { Icons } from "../../components/Icons";

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
      <Link to={newUrl}><button>
        <Icon icon={Icons.solid.faPlus} />
        Add {name}
      </button></Link>
      <DynamicList provider={provider} title={name} nameKey="name" deleteInterceptor={async item => {
        await deleteFolder(`${provider.collectionName}/${item.id}`);
        return true;
      }} adicionalFields={item => <span><b>Attendants: </b>{item.attendants?.join(', ')}</span>} />
    </>;

  return (
    <DynamicForm<Product>
      title={title}
      id={id === newUrl ? undefined : id}
      provider={provider}
      fieldRenderers={{
        attendants: ListRenderer,
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