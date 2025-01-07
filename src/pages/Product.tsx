import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import ProductsProvider, { Product } from "../data/products";
import BannerImage from "../components/BannerImage";

export interface ProductsPageProps {
  provider: ProductsProvider;
  title: string;
}

export default function ProductsPage({title, provider}: ProductsPageProps) {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>();
  const [productList, setProductList] = useState<Product[]>([]);

  useEffect(() => {
    if(!id) {
      provider.listAll().then(setProductList);
      return;
    };
    provider.getById(id).then(setProduct);
  },[id, provider]); 

  if(!id) return <div className="content">
    <h1>{title}</h1>
    <ul>
      {productList.map(product => <li key={product.id}>
        <Link to={`${product.id}`}>{product.name}</Link>
      </li>)}
    </ul>
  </div>;
  
  return <>
    {product && <BannerImage src={product.image}  />}
    <div className="content">
      <h2>{product?.name}</h2>
      <p>{product?.description}</p>
      <span>{product?.price}</span>
      {product?.youtube && <div>
        <iframe width="560" height="315" 
          src={product.youtube
            .replace("/watch?v=", "/embed/")
            .replace("/shorts/", "/embed/")
            .replace("/live/", "/embed/")
            .replace("youtu.be/", "youtube.com/embed/")
          }
          title={product.name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      </div>}
      <ul>
        {product?.infos.map((info, index) => <li key={index}>
          <h3>{info.title}</h3>
          <ul>
            {info.items.map((item, index) => <li key={index}>
              <p>{item}</p>
            </li>)}
          </ul>
        </li>)}
      </ul>
      <h3>Reviews</h3>
      <ul>
        {product?.reviews.map((review, index) => <li key={index}>
          <p>{review}</p>
        </li>)}
      </ul>
    </div>
  </>;
}