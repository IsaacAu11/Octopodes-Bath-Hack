import React, { useEffect, useState } from 'react';
import './asciiRain.css';

const AsciiRain = () => {
  const [rain, setRain] = useState('');

  const columnWidth = 10;
  const rowHeight = 12;

  const asciiChars = "!@#$%^&*()_+-={};:',.<>/?~";
  
  const [cols, setCols] = useState(Math.floor(window.innerWidth / columnWidth));
  const [rows, setRows] = useState(Math.floor(window.innerHeight / rowHeight));

  const [raindrops, setRaindrops] = useState<{
    x: number,
    y: number,
    velocity: number,
    bounceCoefficient: number,
    char: string 
  }[]>([]);

  const getRandomChar = () => {
    return asciiChars[Math.floor(Math.random() * asciiChars.length)];
  };

  const updateRain = () => {
    let output = '';
    const gravity = 0.02;
    const floor = rows - 1;

    let newRaindrops = raindrops.map(drop => {
      let newVelocity = drop.velocity + gravity;
      let newY = drop.y + newVelocity * 0.5;

      if (newY >= floor) {
        newY = floor;
        newVelocity = -newVelocity * drop.bounceCoefficient;
        if (Math.abs(newVelocity) < 0.3) newVelocity = 0;
      }

      if (newY <= 0) {
        newY = 0;
        newVelocity = 0;
      }

      return {
        ...drop,
        y: newY,
        velocity: newVelocity,
        bounceCoefficient: drop.bounceCoefficient * 0.998
      };
    });

    newRaindrops = newRaindrops.filter(drop => 
      !(drop.velocity === 0 && drop.y >= floor - 1)
    );

    // Create the grid
    for (let y = 0; y < rows; y++) {
      let line = '';
      for (let x = 0; x < cols; x++) {
        const raindrop = newRaindrops.find(drop => 
          Math.floor(drop.x) === x && Math.floor(drop.y) === y
        );
        line += raindrop ? raindrop.char : ' ';
      }
      output += line + '\n';
    }

    if (Math.random() < 0.1) {
      const newDrop = {
        x: Math.floor(Math.random() * cols),
        y: 0,
        velocity: 0.2 + Math.random() * 0.3,
        bounceCoefficient: 0.75 + Math.random() * 0.2,
        char: getRandomChar()
      };
      newRaindrops.push(newDrop);
    }

    setRain(output);
    setRaindrops(newRaindrops);
  };

  useEffect(() => {
    const interval = setInterval(updateRain, 10);
    const handleResize = () => {
      setCols(Math.floor(window.innerWidth / columnWidth));
      setRows(Math.floor(window.innerHeight / rowHeight));
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [raindrops]);

  return (
    <pre className="ascii-rain">
      {rain}
    </pre>
  );
};

export default AsciiRain;