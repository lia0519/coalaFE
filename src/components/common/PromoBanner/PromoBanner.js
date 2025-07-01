// src/components/PromoBanner.js

import { useEffect, useState } from 'react';
import './PromoBanner.css';

const PromoBanner = ({ items }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 5000); // 5초마다 전환
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div className="promo-banner">
      <a href={items[current].link} className="banner-slide">
        {items[current].text}
      </a>
    </div>
  );
};

export default PromoBanner;
