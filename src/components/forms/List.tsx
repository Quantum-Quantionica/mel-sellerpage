import { useEffect, useState } from "react";

import { Provider, WithId } from "../../data/provider";
import { Link } from "react-router-dom";

export interface DynamicListProps<T extends WithId> {
  title: string;
  nameKey: keyof T;
  provider: Provider<T>;
  deleteInterceptor?: (item: T) => Promise<boolean> | boolean;
}

export default function DynamicList<T extends WithId>({ title, nameKey, provider, deleteInterceptor }: DynamicListProps<T>) {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    provider.listAll().then(setItems);
  }, []);

  const handleDelete = async (item: T) => {
    if(!item.id) return;
    if(!window.confirm(`Are you sure you want to delete ${item[nameKey]}?`)) return;

    if(deleteInterceptor && !(await deleteInterceptor(item))) return
    await provider.delete(item.id);
    setItems(items.filter(listItem => listItem.id !== item.id));
  };

  return (
    <div>
      <h1>{title}</h1>
      <ul>
        {items.map(item => (
          item.id && <li key={item.id}>
            <Link to={item.id}>
              {item[nameKey] as string || `No ${nameKey as string} found`}
            </ Link>
            <button onClick={() => handleDelete(item)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}