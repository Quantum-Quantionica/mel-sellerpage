import React, { useEffect, useState } from "react";

import { WithId, Provider } from "../../data/provider";

export interface DynamicFormProps<T extends WithId> {
  id?: string;
  title: string;
  provider: Provider<T>;
  fieldRenderers?: { [key in keyof T]?: FieldRenderer<T> };
}

export default function DynamicForm<T extends WithId>({ id, title, provider, fieldRenderers }: DynamicFormProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>({});

  const handleChange = (key: keyof T, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await provider.save(formData as T);
      alert("Saved successfully!");
    } catch (error) {
      console.error("Error saving:", error);
    }
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
        const stringKey = key as string;
        const value = formData[key];
        const Field: FieldRenderer<T> = (fieldRenderers?.[key] || Input) as FieldRenderer<T>;

        return (
          <Field
            key={stringKey}
            name={stringKey}
            value={value}
            item={formData}
            onChange={newValue => handleChange(key, newValue)}
            provider={provider}
          />
        );
      })}
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export type FieldRendererPros<T extends WithId> = {
  provider: Provider<T>
  item: Partial<T>
  name: string
  value: any
  onChange: (value: any) => void
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

interface ListRendererProps<T extends WithId> extends FieldRendererPros<T> {
  value: string[];
}
export const ListRenderer = <T extends WithId>({ name, value, onChange, provider, item }: ListRendererProps<T>) => (
  <div>
    <label>{name}</label>
    {value.map((itemValue, index) => (
      <Input
        key={index}
        item={item}
        provider={provider}
        name={`${name} [${index + 1}]`}
        value={itemValue}
        onChange={(newVal) => {
          const newList = [...value];
          newList[index] = newVal;
          onChange(newList);
        }}
      />
    ))}
    <button type="button" onClick={() => onChange([...value, ""]) }>Add Item</button>
  </div>
)