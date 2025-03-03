import { useEffect, useRef, useState } from "react";

import { Page } from "../../../main/data/attendants";
import { WithId } from "../../../main/data/provider";

import { FieldRendererPros, Input } from "../../forms";
import IconRenderer from "../../forms/renderers/IconRenderer";

const PageRenderer = <T extends WithId>({value, onChange, ...props}: FieldRendererPros<T>) => {
  const valueRef = useRef<Partial<Page>>(typeof value !== "object" ? {} : value);
  const [name, setName] = useState(valueRef.current.name || "");
  const [icon, setIcon] = useState(valueRef.current.icon || "");
  const [type, setType] = useState(valueRef.current.type || "");
  const [url, setUrl] = useState(valueRef.current.url || "");
  

  useEffect(() => {
    if (typeof value === "object") {
      setIcon(value.icon || "");
      setName(value.name || "");
      setUrl(value.url || "");
      setType(value.type || "");
    }
  },[value]);

  return <>
    <IconRenderer 
      provider={props.provider} item={props.item} save={props.save}
      name="Icon" value={icon} onChange={(text: string) => {
        setIcon(text);
        valueRef.current.icon = text;
        onChange(valueRef.current);
      }} />
    <Input 
      provider={props.provider} item={props.item} save={props.save}
      name="Name" value={name} onChange={(text: string) => {
        setName(text);
        valueRef.current.name = text;
        onChange(valueRef.current);
      }} />
    <Input
      provider={props.provider} item={props.item} save={props.save}
      name="Page Url" value={url} onChange={(text: string) => {
        const newText = snakeCase(text);
        setUrl(newText);
        valueRef.current.url = newText;
        onChange(valueRef.current);
      }} />
    <Input 
      provider={props.provider} item={props.item} save={props.save}
      name="Database Type" value={type} onChange={(text: string) => {
        const newText = snakeCase(text);
        setType(newText);
        valueRef.current.type = newText;
        onChange(valueRef.current);
      }} />
  </>;
};
export default PageRenderer;

function snakeCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/gi, "");
}