import { useEffect, useState } from 'react';
import './Carrosel.css';

import { Link } from 'react-router-dom';
import { useConfigs } from '../main/ConfigProvider';

export interface CarroseItem {
  image?: string;
  title?: string;
  link?: string;
}

export default function Carrose() {
  const configs = useConfigs();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = currentIndex < (configs?.carrosel?.length || 1) -1 ? currentIndex + 1 : 0;
      setCurrentIndex(currentIndex);
    }, 4000);
    return () => clearInterval(interval);
  }, [configs]);

  return <section className="carrosel">
    <div>
      {configs?.carrosel?.map((bdItem, index) => {
        const item: CarroseItem = typeof bdItem === 'string' ? {image: bdItem} : bdItem;
        if(!item.image) return null;

        const className = 'item ' + (currentIndex===index ? 'active' : '');
        const style = {backgroundImage: `url(${item.image})`};

        if(item.link) return <Link key={index} to={item.link} style={style} className={className} title={item.title} />;
        return <div key={index} style={style} className={className} title={item.title} />
      })}
    </div>
  </section>;
}