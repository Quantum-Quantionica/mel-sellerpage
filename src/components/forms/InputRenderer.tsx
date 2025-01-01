import { WithId } from "../../data/provider";
import { FieldRendererPros } from "./";

export const Input = <T extends WithId>({name, value, onChange }: FieldRendererPros<T>) => (
  <div>
    <label>{name}</label>
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

export const TextArea = <T extends WithId>({ name, value, onChange }: FieldRendererPros<T>) => (
  <div>
    <label>{name}</label>
    <textarea value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);