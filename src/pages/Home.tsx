import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Carrosel from "../components/Carrosel";
import ProductsProvider, { Product } from "../main/data/products";
import ProductHomeThumb from "./Products/ProductHomeThumb";

const homeProdutsProvider = new ProductsProvider();

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    homeProdutsProvider.listHomeProducts().then(setProducts);
  }, []);

  return <div className="content">
    <Carrosel />
    <h1 style={{
      marginTop: "1.5em",
    }}>Destaques</h1>
    <div className="products-box home">
      {products.map(product => 
        <ProductHomeThumb key={product.id} item={product} onSelected={() => navigate(product.id!)} />
      )}
    </div>
  </div>;
}