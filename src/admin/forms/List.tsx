import { useEffect, useState } from "react";

import { Provider, WithId } from "../../main/data/provider";
import { Link } from "react-router-dom";
import Icon, { Icons } from "../../components/Icons";

export interface DynamicListProps<T extends WithId> {
  title: string;
  nameKey: keyof T;
  provider: Provider<T>;
  adicionalFields?: (item: T) => JSX.Element;
  deleteInterceptor?: (item: T) => Promise<boolean> | boolean;
}

export default function DynamicList<T extends WithId>({ title, nameKey, provider, deleteInterceptor, adicionalFields }: DynamicListProps<T>) {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    provider.listAll().then(setItems);
  }, [provider]);

  const handleDelete = async (item: T) => {
    if(!item.id) return;
    if(!window.confirm(`Are you sure you want to delete ${item[nameKey]}?`)) return;

    if(deleteInterceptor && !(await deleteInterceptor(item))) return
    await provider.delete(item.id);
    setItems(items.filter(listItem => listItem.id !== item.id));
  };

  return (
    <div className="dynamic-list">
      <h1>{title}</h1>
      <ul>
        {items.map(item => (
          item.id && <li key={item.id}>
            <span>Id: {item.id}</span>
            <strong style={{display: "block"}}>
              <Link to={item.id}>
                {item[nameKey] as string || `No ${nameKey as string} found`}
              </Link>
            </strong>
            <div className="spacer" />
            {adicionalFields && adicionalFields(item)}
            <button onClick={() => handleDelete(item)}>
              <Icon icon={Icons.solid.faTrash} />
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}