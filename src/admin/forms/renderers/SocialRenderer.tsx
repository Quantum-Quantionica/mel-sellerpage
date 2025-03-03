import { useEffect, useRef, useState } from "react";

import { FieldRendererPros, Input } from "..";
import { AttendantSocialLink } from "../../../main/data/attendants";
import { WithId } from "../../../main/data/provider";
import IconRenderer from "./IconRenderer";

const SocialRenderer = <T extends WithId>({value, onChange, ...props}: FieldRendererPros<T>) => {
  const valueRef = useRef<Partial<AttendantSocialLink>>(typeof value !== "object" ? {} : value);
  const [name, setName] = useState(valueRef.current.name || "");
  const [icon, setIcon] = useState(valueRef.current.icon || "");
  const [link, setLink] = useState(valueRef.current.link || "");
  

  useEffect(() => {
    if (typeof value === "object") {
      setName(value.name || "");
      setIcon(value.icon || "");
      setLink(value.link || "");
    }
  },[value]);

  return <>
    <Input
      provider={props.provider} item={props.item} save={props.save}
      name="Link" value={link} onChange={(text: string) => {
        setLink(text);
        valueRef.current.link = text;
        onChange(valueRef.current);
      }} />
    <Input 
      provider={props.provider} item={props.item} save={props.save}
      name="Network Name" value={name} onChange={(text: string) => {
        const newText = captalistFirstLetterOfEachWord(text);
        setName(newText);
        valueRef.current.name = newText;
        onChange(valueRef.current);
      }} />
    <IconRenderer 
      provider={props.provider} item={props.item} save={props.save}
      name="Icon" value={icon} onChange={(text: string) => {
        setIcon(text);
        valueRef.current.icon = text;
        onChange(valueRef.current);
      }} />
  </>;
};
export default SocialRenderer;

function captalistFirstLetterOfEachWord(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}