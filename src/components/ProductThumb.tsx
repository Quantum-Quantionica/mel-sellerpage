import { useConfigs } from "../app/ConfigProvider";
import { Product } from "../data/products";
import Icon, { Icons } from "./Icons";

import "./ProductThumb.css";

export interface ProductProps {
  item: Product;
  onSelected: (product: Product) => void;
}

export default function ProductThumb({ item, onSelected }: ProductProps) {
  const configs = useConfigs();

  return <div className="product-item" style={{borderColor: configs.headerAssentColor}}>
    <div className="product-image" style={{ backgroundImage: `url(${item.image})` }} />
    <span>{item.category || item.type}</span>
    <h2>{item.name.capitalizeSelective()}</h2>
    <div className="product-actions">
      <a className="button-by" href={item.purchaseUrl} style={{
        backgroundColor: configs.markColor,
      }}><Icon icon={Icons.solid.faCartShopping} />Adquirir</a>
      <a className="button-by" onClick={() => onSelected(item)} style={{
        backgroundColor: configs.backgroundColor,
        color: configs.menuAssentColor,
      }}><Icon icon={Icons.solid.faEye} />Ver Mais</a>
    </div>
  </div>
}

String.prototype.capitalizeSelective = function () {
  return this.toLocaleLowerCase().split(" ")
    .map((word, index) => (word.length > 2 || index == 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(" ");
}