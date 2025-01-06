import { useEffect, useRef, useState } from "react";

import { WithId } from "../../../data/provider";
import { SiteConfig, ConfigKeys } from "../../../configs/siteConfigs";
import { FieldRendererPros, ImageRenderer, Input } from "../../../components/forms";

const SiteConfigsRenderer = <T extends WithId>({ value, onChange, ...props }: FieldRendererPros<T>) => {
  const valueRef = useRef<Partial<SiteConfig>>(typeof value !== "object" ? {} : value);
  const [logo, setLogo] = useState(valueRef.current.logo || "");

  useEffect(() => {
    if (typeof value === "object") {
      valueRef.current = value;
      setLogo(value.logo || "");
    }
  }, [value]);

  return <>
    <h2>Site Configs</h2>
    <ImageRenderer
      provider={props.provider} item={props.item} save={props.save}
      name="Logo" value={logo} onChange={(text: string) => {
        setLogo(text);
        valueRef.current.logo = text;
        onChange(valueRef.current);
      }} />
    {ConfigKeys.map((item) =>
      <Input
        key={item}
        provider={props.provider} item={props.item} save={props.save}
        name={item} value={valueRef.current[item]} onChange={(text: string) => {
          valueRef.current[item] = text;
          onChange(valueRef.current);
        }} />
    )}
  </>;
};
export default SiteConfigsRenderer;