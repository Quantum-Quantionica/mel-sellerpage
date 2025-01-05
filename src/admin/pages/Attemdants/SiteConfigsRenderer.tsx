import { useEffect, useRef, useState } from "react";

import { WithId } from "../../../data/provider";
import { SiteConfig } from "../../../data/attendants";
import { FieldRendererPros, ImageRenderer } from "../../../components/forms";

const SiteConfigsRenderer = <T extends WithId>({value, onChange, ...props}: FieldRendererPros<T>) => {
  const valueRef = useRef<Partial<SiteConfig>>(typeof value !== "object" ? {} : value);
  const [logo, setLogo] = useState(valueRef.current.logo || "");
  

  useEffect(() => {
    if (typeof value === "object") {
      setLogo(value.logo || "");
    }
  },[value]);

  return <>
    <ImageRenderer
      provider={props.provider} item={props.item} save={props.save}
      name="Logo" value={logo} onChange={(text: string) => {
        setLogo(text);
        valueRef.current.logo = text;
        onChange(valueRef.current);
      }} />
  </>;
};
export default SiteConfigsRenderer;