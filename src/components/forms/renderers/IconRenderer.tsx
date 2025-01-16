import { WithId } from "../../../data/provider";
import { FieldRendererPros, Input } from "../";
import { getIconByCaseInsensitiveName } from "../../Icons";

const IconRenderer = <T extends WithId>({ name, value, onChange }: FieldRendererPros<T>) => {
  const iconInstance = getIconByCaseInsensitiveName(value);
  return <div>
    <Input name={name} value={value} onChange={onChange} icon={iconInstance} />
  </div>
};

export default IconRenderer;