import { WithId } from "../../../data/provider";
import { FieldRendererPros } from "../";
import Icon, { IconDefinition } from "../../Icons";

type InputProps<T extends WithId> = FieldRendererPros<T> & { icon: IconDefinition };

export const Input = <T extends WithId>({name, value, onChange, icon }: InputProps<T>) => (
  <div>
    <label>{name}</label>
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    <Icon icon={icon} />
  </div>
);

export const TextArea = <T extends WithId>({ name, value, onChange }: FieldRendererPros<T>) => (
  <div>
    <label>{name}</label>
    <textarea value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);