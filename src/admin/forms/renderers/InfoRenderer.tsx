import { useEffect, useRef, useState } from "react";

import { FieldRendererPros, Input, ListRenderer } from "../";
import { WithId } from "../../../main/data/provider";
import { ProductInfoList } from "../../../main/data/products";

type InputProps<T extends WithId> = React.ImgHTMLAttributes<HTMLInputElement> & FieldRendererPros<T>;


const InfoRenderer = <T extends WithId>({name, value, onChange, ...props}: InputProps<T>) => {
  const valueRef = useRef<Partial<ProductInfoList>>(typeof value !== "object" ? {} : value);
  const [title, setTitle] = useState(valueRef.current.title || "");
  const [items, setItems] = useState(valueRef.current.items || []);

  useEffect(() => {
    if (typeof value === "object") {
      setTitle(value.title || "");
      setItems(value.items || []);
    }
  },[value]);

  return <div>
    <label>{name}:</label>
    <Input  {...props} name="Titulo" value={title} onChange={text => {
      setTitle(text);
      valueRef.current.title = text;
      onChange(valueRef.current);
    }} />
    <ListRenderer
      name="SubItems"
      save={props.save}
      provider={props.provider}
      item={props.item}
      value={items}
      onChange={list => {
        setItems(list);
        valueRef.current.items = list;
        onChange(valueRef.current);
      }}/>
  </div>;
};
export default InfoRenderer;