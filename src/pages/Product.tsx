import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "./Product.css";
import ProductsProvider, { Product } from "../data/products";
import BannerImage from "../components/BannerImage";
import Icon, { getIconByCaseInsensitiveName, Icons } from "../components/Icons";
import { useConfigs } from "../app/ConfigProvider";
import WhoWeAre from "./WhoWeAre";

export interface ProductsPageProps {
  provider: ProductsProvider;
  title: string;
}

const formatPrice = (product: Product) => {
  const price = (product.price + '').replace(",", ".");
  return Number.parseFloat(price).toLocaleString("en-US", {
    style: "currency",
    currency: "BRL",
  }).replace(",", "x").replace(".", ",").replace("x", ".").replace("R$", "R$ ");
}

export default function ProductsPage({ title, provider }: ProductsPageProps) {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>();
  const [productList, setProductList] = useState<Product[]>([]);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const buttonRef = useRef<HTMLAnchorElement>(null);
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
    const handleScroll = () => {
      if(buttonRef.current)
        setShowFloatingButton(!isElementVisible(buttonRef.current))
    }
    return registerWindowMoveEvent(handleScroll);
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
    <div className="content product" style={{margin: '20px auto 80px auto'}}>
      <h2>{product.name}</h2>
      <div className="product-box">
        <div className="info">
          <div>{product.description}</div>
          <div className="spacer"></div>
          <span className="price">{formatPrice(product)}</span>
          <span className="paymentType">{product.paymentInfo}</span>
          <div className="spacer"></div>
          <a className="button-by" href={product.purchaseUrl} ref={buttonRef} style={{
            backgroundColor: configs.markColor,
          }}><Icon icon={Icons.solid.faCartShopping} />Adquirir</a>
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
      <hr style={{borderColor: configs.headerAssentColor}} />
      <WhoWeAre />
      <a className={`button-by floating${showFloatingButton ? '' : ' hide'}`} href={product.purchaseUrl} style={{
        backgroundColor: configs.markColor,
      }}><Icon icon={Icons.solid.faCartShopping} />Adquirir</a>
    </div>
  </>;
}

const isElementVisible = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

export const registerWindowMoveEvent = (callback: () => void) => {
  const root = document.getElementById('root');
  root?.addEventListener('scroll', callback);

  window.addEventListener('scroll', callback);
  window.addEventListener('resize', callback);
  callback();
  return () => {
    root?.removeEventListener('scroll', callback);
    window.removeEventListener('scroll', callback);
    window.removeEventListener('resize', callback);
  }
}
