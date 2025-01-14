import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "./Product.css";
import ProductsProvider, { Product } from "../data/products";
import BannerImage from "../components/BannerImage";
import Icon, { getIconByCaseInsensitiveName, Icons } from "../components/Icons";
import { useConfigs } from "../app/ConfigProvider";

export interface ProductsPageProps {
  provider: ProductsProvider;
  title: string;
}

const formatPrice = (product: Product) => {
  const price = (product.price + '').replace(",", "0");
  return Number.parseFloat(price).toLocaleString("en-US", {
    style: "currency",
    currency: "BRL",
  }).replace(",", "x").replace(".", ",").replace("x", ".").replace("R$", "R$ ");
}

export default function ProductsPage({ title, provider }: ProductsPageProps) {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>();
  const [productList, setProductList] = useState<Product[]>([]);
  const [floatingBottomMargin, setFloatingBottomMargin] = useState(0);
  const configs = useConfigs();

  useEffect(() => {
    if (!id) {
      provider.listAll().then(setProductList);
      return;
    };
    provider.getById(id).then(setProduct);
    return () => setProduct(null);
  }, [id, provider, productList.length]);

  useEffect(() => {
    const root = document.getElementById('root');
    const handleScroll = () => {
      const footer = document.querySelector('footer');
      if (!footer) return;
      setFloatingBottomMargin(window.innerHeight - footer.getBoundingClientRect().top + 20);
    }
    root?.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      root?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (!id) return <div className="content">
    <h1>{title}</h1>
    <ul>
      {productList.map(product => <li key={product.id}>
        <Link to={`${product.id}`}>{product.name}</Link>
      </li>)}
    </ul>
  </div>;

  if (!product) return <></>;

  return <>
    {product && <BannerImage src={product.image} />}
    <div className="content">
      <h2>{product.name}</h2>
      <div className="product-box">
        <div className="info">
          <div>{product.description}</div>
          <div className="spacer"></div>
          <span className="price">{formatPrice(product)}</span>
          <span className="paymentType">{product.paymentInfo}</span>
          <div className="spacer"></div>
          <a className="button-by" href={product.purchaseUrl} style={{
            backgroundColor: configs.markColor,
          }}><Icon icon={Icons.solid.faCartShopping} />Comprar</a>
        </div>
        {product.youtube && <div className="video">
          <iframe
            src={product.youtube
              .replace("/watch?v=", "/embed/")
              .replace("/shorts/", "/embed/")
              .replace("/live/", "/embed/")
              .replace("youtu.be/", "youtube.com/embed/")
            }
            title={product.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>}
      </div>
      <ul className="mark-list">
        {product.infos.map((info, index) => <li key={index}>
          <h3>{info.title}</h3>
          <ul>
            {info.items.map((item, index) => <li key={index}>
              <Icon icon={getIconByCaseInsensitiveName(configs.markIcon)} style={{ color: configs.markColor }} /><div>{item}</div>
            </li>)}
          </ul>
        </li>)}
      </ul>
      {product.reviews && product.reviews.length !== 0 && <>
        <h3>Reviews</h3>
        <ul>
          {product.reviews.map((review, index) => <li key={index}>
            <p>{review}</p>
          </li>)}
        </ul>
      </>
      }
      <a className="button-by floating" href={product.purchaseUrl} style={{
        backgroundColor: configs.markColor,
      }}><Icon icon={Icons.solid.faCartShopping} />Comprar</a>
    </div>
    {floatingBottomMargin > 20 && <style>{`
.button-by.floating {
    bottom: ${floatingBottomMargin}px;
}
      `}</style>}
  </>;
}