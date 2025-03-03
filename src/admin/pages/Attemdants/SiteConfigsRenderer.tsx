import { useEffect, useRef, useState } from "react";

import { ConfigKeys, SiteConfig } from "../../../main/configs/siteConfigs";
import { WithId } from "../../../main/data/provider";

import { FieldRenderer, FieldRendererPros, ImageRenderer, Input, ListRenderer, ListRendererConfigs } from "../../forms";
import IconRenderer from "../../forms/renderers/IconRenderer";
import CarroselItemRenderer from "./CarroselItemRenderer";
import PageRenderer from "./PageRenderer";

const ConfigKeysRenderer: { [key in keyof SiteConfig]?: FieldRenderer<any> } = {
  "markIcon": IconRenderer,
  "carrosel": ListRenderer,
  "pages": ListRenderer,
}
const ConfigKeysRendererConfigs: { [key in keyof SiteConfig]?: object } = {
  "carrosel": {
    renderer: CarroselItemRenderer,
  } as ListRendererConfigs<SiteConfig & { id?: string }>,
  "pages": {
    renderer: PageRenderer,
  } as ListRendererConfigs<SiteConfig & { id?: string }>,
}


const SiteConfigsRenderer = <T extends WithId>({ value, onChange, ...props }: FieldRendererPros<T>) => {
  const valueRef = useRef<Partial<SiteConfig>>(typeof value !== "object" ? {} : value);
  const [logo, setLogo] = useState(valueRef.current.logo || "");
  const [favicon, setFavicon] = useState(valueRef.current.favicon || "");
  const [fotterLogo, setFotterLogo] = useState(valueRef.current.fotterLogo || "");

  useEffect(() => {
    if (typeof value === "object") {
      valueRef.current = value;
      setLogo(value.logo || "");
    }
  }, [value]);

  return <div style={{ padding: "1em", border: "1px solid #ccc", borderRadius: "5px", backgroundColor: "#fadfdf" }}>
    <h2>Site Configs</h2>
    <ImageRenderer
      provider={props.provider} item={props.item} save={props.save}
      name="Logo" value={logo} onChange={(text: string) => {
        setLogo(text);
        valueRef.current.logo = text;
        onChange(valueRef.current);
      }} />
    <ImageRenderer
      provider={props.provider} item={props.item} save={props.save}
      name="Tab Fav Icon" value={favicon} onChange={(text: string) => {
        setFavicon(text);
        valueRef.current.favicon = text;
        onChange(valueRef.current);
      }} />
    <ImageRenderer
      provider={props.provider} item={props.item} save={props.save}
      name="Fotter Logo" value={fotterLogo} onChange={(text: string) => {
        setFotterLogo(text);
        valueRef.current.fotterLogo = text;
        onChange(valueRef.current);
      }} />
    {ConfigKeys.map((item) => {
      const Renderer: FieldRenderer<any> = ConfigKeysRenderer[item] || Input;
      return <Renderer
        key={item}
        configs={ConfigKeysRendererConfigs[item]}
        provider={props.provider} item={props.item} save={props.save}
        name={item} value={valueRef.current[item]} onChange={(text: string) => {
          valueRef.current[item] = text;
          onChange(valueRef.current);
        }} />
    })}
  </div>;
};
export default SiteConfigsRenderer;