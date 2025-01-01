import { useEffect, useRef } from "react";
import { FieldRenderer, FieldRendererPros, Input } from ".";
import { WithId } from "../../data/provider";

export interface ListRendererConfigs<T extends WithId> {
  renderer: FieldRenderer<T>
  addMultipleValues?: boolean;
}
interface ListRendererProps<T extends WithId> extends FieldRendererPros<T, ListRendererConfigs<T>> {
  value: string[];
}
export default function ListRenderer<T extends WithId>({ name, value, onChange, provider, item, configs, save }: ListRendererProps<T>) {
  const Element = configs?.renderer || Input;
  const listRef = useRef<any[]>(value || []);

  useEffect(() => {
    listRef.current = value || [];
    const list = listRef.current;
    if(listRef.current.length === 0) {
      listRef.current.push("");
      return;
    }
    const last = list[list.length - 1];
    if (
      (typeof last === "string" && last.trim().length !== 0) ||
      (typeof last === "object" && Object.keys(last).length !== 0)
    )
      list.push(undefined);
  }, [value]);

  return <div>
    <label>{name}</label>
    <ul>
      {listRef.current.map((itemValue, index) => (<li key={index}>
        <Element
          item={item}
          provider={provider}
          name={`${name}[${index}]`}
          value={itemValue}
          onChange={value => {
            listRef.current[index] = value;
            onChange(listRef.current);
          }}
          configs={configs}
          save={save}
        />
      </li>))}
    </ul>
    <button type="button" onClick={() => {
      listRef.current.push(undefined);
      onChange(listRef.current)
    }}>Add {name} Item</button>
  </div>
}