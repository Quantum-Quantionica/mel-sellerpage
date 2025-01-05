import { useEffect, useRef, useState } from "react";

import { WithId } from "../../../data/provider";
import { AttendantOrganizationalCulture } from "../../../data/attendants";
import { FieldRendererPros, TextArea } from "../../../components/forms";

const OrganizationalCultureRenderer = <T extends WithId>({value, onChange}: FieldRendererPros<T>) => {
  const valueRef = useRef<Partial<AttendantOrganizationalCulture>>(typeof value !== "object" ? {} : value);
  const [mission, setMission] = useState(valueRef.current.mission || "");
  const [vision, setVision] = useState(valueRef.current.vision || "");
  const [values, setValues] = useState(valueRef.current.values || []);
  

  useEffect(() => {
    if (typeof value === "object") {
      setMission(value.mission || "");
      setVision(value.vision || "");
      setValues(value.values || []);
    }
  },[value]);

  return <>
    <TextArea name="Mission" value={mission} onChange={(text: string) => {
      setMission(text);
      valueRef.current.mission = text;
      onChange(valueRef.current);
    }} />
    <TextArea name="Vision" value={vision} onChange={(text: string) => {
      setVision(text);
      valueRef.current.vision = text;
      onChange(valueRef.current);
    }} />
    <TextArea name="Values" value={values} onChange={(text: string) => {
      setValues(text);
      valueRef.current.values = text;
      onChange(valueRef.current);
    }} />
  </>;
};
export default OrganizationalCultureRenderer;