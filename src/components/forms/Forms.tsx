import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { WithId, Provider } from "../../data/provider";

export interface DynamicFormProps<T extends WithId> {
  id?: string;
  title: string;
  provider: Provider<T>;
  fieldRenderers?: { [key in keyof T]?: FieldRenderer<T> };
  fieldConfigs?: { [key in keyof T]: object };
}

export default function DynamicForm<T extends WithId>({ id, title, provider, fieldRenderers, fieldConfigs }: DynamicFormProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>({});
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (key: keyof T, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (): Promise<Partial<T>> => {
    let newData = formData;
    try {
      newData = await provider.save(formData as T);
      if (!id && newData.id) {
        const pathSegments = location.pathname.split('/');
        pathSegments[pathSegments.length - 1] = newData.id;
        navigate(pathSegments.join('/'), { replace: true });
      }
      setError(null);
    } catch (error) {
      setError(`${error}`);
    }
    return newData;
  };

  useEffect(() => {
    if(id) {
      provider.getById(id).then(item => {
        if(!item) return
        setFormData(item);
      });
    }
  },[id]);

  return (
    <div>
      <h1>{title}</h1>
      {provider.keys.map(key => {
        const value = formData[key];
        const Field: FieldRenderer<T> = (fieldRenderers?.[key] || Input) as FieldRenderer<T>;

        return (
          <Field
            key={key as string}
            name={key}
            value={value}
            item={formData}
            onChange={newValue => handleChange(key, newValue)}
            provider={provider}
            configs={fieldConfigs?.[key] as any}
            save={handleSave}
          />
        );
      })}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export type FieldRendererPros<T extends WithId, Configs=any> = {
  provider: Provider<T>
  item: Partial<T>
  name: keyof T
  value: any
  configs?: Configs
  onChange: (value: any) => void
  save: () => Promise<Partial<T>>
};
export type FieldRenderer<T extends WithId> = React.FC<FieldRendererPros<T>>;

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

export interface ListRendererConfigs<T extends WithId> {
  renderer: FieldRenderer<T>
  autoSave: boolean
}
interface ListRendererProps<T extends WithId> extends FieldRendererPros<T, ListRendererConfigs<T>> {
  value: string[];
}
export function ListRenderer<T extends WithId>({ name, value, onChange, provider, item, configs, save }: ListRendererProps<T>) {
  const Element = configs?.renderer || Input;
  const list = value || [];
  function addLastItem() {
    if(list[list.length - 1]?.trim && list[list.length - 1].trim() === "") return;
    list.push("");
  }
  addLastItem();

  return <div>
    <label>{name}</label>
    <ul>
      {list.map((itemValue, index) => (<li key={index}>
        <Element
          item={item}
          provider={provider}
          name={`${name}[${index}]`}
          value={itemValue}
          onChange={(newVal) => {
            const newList = [...value];
            newList[index] = newVal;
            onChange(newList);
            if(configs?.autoSave) save();
          }}
          configs={configs}
          save={save}
        />
      </li>))}
    </ul>
    <button type="button" onClick={() => {
      addLastItem();
      onChange(list) 
    }}>Add {name} Item</button>
  </div>
}