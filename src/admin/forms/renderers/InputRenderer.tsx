import './InputRenderer.css';
import { WithId } from "../../../main/data/provider";
import { FieldRendererPros } from "../";
import Icon, { IconDefinition } from "../../../components/Icons";

type InputProps<T extends WithId> = FieldRendererPros<T> & { icon: IconDefinition };

export const Input = <T extends WithId>({name, value, onChange, icon }: InputProps<T>) => (
  <div className="input-box">
    <label>{name}</label>
    <Icon icon={icon} />
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

export const TextArea = <T extends WithId>({ name, value, onChange }: FieldRendererPros<T>) => (
  <div className="input-box">
    <label>{name}</label>
    <textarea value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);