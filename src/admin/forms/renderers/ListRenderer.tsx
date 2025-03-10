import { useEffect, useRef, useState } from "react";
import './ListRenderer.css';

import { WithId } from "../../../main/data/provider";

import { FieldRenderer, FieldRendererPros, Input } from "../";
import Icon, { Icons } from '../../../components/Icons';

export interface ListRendererConfigs<T extends WithId> {
  renderer: FieldRenderer<T>
  addMultipleValues?: boolean;
}
interface ListRendererProps<T extends WithId> extends FieldRendererPros<T, ListRendererConfigs<T>> {
  value: string[];
}
export default function ListRenderer<T extends WithId>({ name, value, onChange, provider, item, configs, save }: ListRendererProps<T>) {
  const Element = configs?.renderer || Input;
  const [list, setList] = useState<any[]>(Array.isArray(value) ? value : []);
  const listRef = useRef<any[]>(list);

  const processAddLast = (list: any[]) => {
    listRef.current = list;
    if(list.length === 0) {
      list.push(undefined);
    } else {
      const last = list[list.length - 1];
      if (
        !!last ||
        (typeof last === "string" && last.trim().length !== 0) ||
        (typeof last === "object" && Object.keys(last).length !== 0)
      )
        list.push(undefined);
    }
    setList([...list]);
  }

  useEffect(() => {
    processAddLast(value || []);
  }, [value]);

  return <div className="list-box">
    <div>
      <label>{name}</label>
      <button type="button" onClick={() => {
        list.push(undefined);
        onChange(list)
      }}>
        <Icon icon={Icons.solid.faPlus} />
        Add {name} Item
      </button>
    </div>
    <ul>
      {list.map((itemValue, index) => (<li key={index}>
        <Element
          item={item}
          provider={provider}
          name={`${name}[${index}]`}
          value={itemValue}
          onChange={changedValue => {
            listRef.current[index] = changedValue;
            processAddLast(listRef.current);
            onChange(listRef.current);
          }}
          configs={configs}
          save={save}
        />
      </li>))}
    </ul>
  </div>
}