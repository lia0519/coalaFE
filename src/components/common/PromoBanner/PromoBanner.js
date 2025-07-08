// src/components/PromoBanner.js

import { useEffect, useState } from 'react';
import './PromoBanner.css';

const PromoBanner = ({ items }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 3000); // 5초마다 전환
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div className="promo-banner">
      <div
        className="banner-track"
        style={{ transform: `translateX(-${current * 100}%)` }}>

        {items.map((item, index) => (
          <a key={index} href={item.link} className='banner-slide'>
            {item.text}
          </a>
        ))}    
      </div>
    </div>
  );
};

export default PromoBanner;
