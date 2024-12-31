import { useEffect, useState } from "react";

import { Provider, WithId } from "../../data/provider";
import { Link } from "react-router-dom";

export interface DynamicListProps<T extends WithId> {
  title: string;
  nameKey: keyof T;
  provider: Provider<T>;
}

export default function DynamicList<T extends WithId>({ title, nameKey, provider }: DynamicListProps<T>) {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    provider.listAll().then(setItems);
  }, []);

  const handleDelete = async (id: string) => {
    await provider.delete(id);
    setItems(items.filter(item => item.id !== id));
  };

  // get route url base
  

  return (
    <div>
      <h1>{title}</h1>
      <ul>
        {items.map(item => (
          item.id && <li key={item.id}>
            <Link to={item.id}>
              {item[nameKey] as string || `No ${nameKey} found`}
            </ Link>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}