import { useEffect, useState } from 'react';
import { useConfigs } from '../app/ConfigProvider';
import './Carrosel.css';

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
    <h2>Carrosel</h2>
    <div>
      {configs?.carrosel?.map((image, index) => 
        <div key={index} style={{backgroundImage: `url(${image})`}} className={currentIndex===index ? 'active' : ''} />
      )}
    </div>
  </section>;
}