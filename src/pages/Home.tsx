import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Carrosel from "../components/Carrosel";
import ProductsProvider, { Product } from "../main/data/products";
import ProductThumb from "./Products/ProductThumb";

const homeProdutsProvider = new ProductsProvider();

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    homeProdutsProvider.listHomeProducts().then(setProducts);
  }, []);

  return <div className="content">
    <h1 style={{
      marginTop: "1em",
      textAlign: "center",
    }}>Destaques</h1>
    <Carrosel />
    <div className="products-box">
      {products.map(product => 
        <ProductThumb key={product.id} item={product} onSelected={() => navigate(product.id!)} />
      )}
    </div>
  </div>;
}