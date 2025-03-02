import { useEffect, useRef, useState } from "react";

import { WithId } from "../../../main/data/provider";

import { CarroseItem } from "../../../components/Carrosel";
import { FieldRendererPros, ImageRenderer, Input } from "../../forms";

const CarroselItemRenderer = <T extends WithId>({ value, onChange, ...props }: FieldRendererPros<T>) => {

  const valueRef = useRef<Partial<CarroseItem>>(
    typeof value === "string" ? { image: value } : (typeof value !== "object" ? {} : value)
  );
  const [imagem, setImage] = useState(valueRef.current.image);
  const [title, setTitle] = useState(valueRef.current.title);
  const [link, setLink] = useState(valueRef.current.link);

  useEffect(() => {
    if (typeof value === "object") {
      valueRef.current = value;
      setImage(value.image);
      setTitle(value.title);
      setLink(value.link);
    }
    if (typeof value === "string") {
      valueRef.current = { image: value };
      setImage(value);
    }
  }, [value]);

  return <>
    <ImageRenderer
      provider={props.provider} item={props.item} save={props.save}
      name="Logo" value={imagem} onChange={(text: string) => {
        setImage(text);
        valueRef.current.image = text;
        onChange(valueRef.current);
      }} />
    <Input
      provider={props.provider} item={props.item} save={props.save}
      name="Title" value={title || ''} onChange={(text: string) => {
        setTitle(text);
        valueRef.current.title = text;
        onChange(valueRef.current);
      }} />
    <Input 
      provider={props.provider} item={props.item} save={props.save}
      name="Link" value={link || ''} onChange={(text: string) => {
        setLink(text);
        valueRef.current.link = text;
        onChange(valueRef.current);
      }} />
  </>;
};
export default CarroselItemRenderer;