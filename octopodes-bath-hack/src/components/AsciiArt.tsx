'use client';

import React, { useState, useEffect } from 'react';

interface AsciiArtProps {
  imageUrl: string;
  width?: number;
  height?: number;
  className?: string;
}

interface ColoredChar {
  char: string;
  color: string;
}

const AsciiArt: React.FC<AsciiArtProps> = ({ imageUrl, width = 100, height = 50, className }) => {
  const [asciiArt, setAsciiArt] = useState<ColoredChar[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAsciiChar = (intensity: number): string => {
    const asciiChars = '@%#*+=-:. ';
    const index = Math.floor((intensity * (asciiChars.length - 1)) / 255);
    return asciiChars[index];
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (c: number) => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const getPixelsFromCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number): number[][] => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels: number[][] = [];
    
    for (let y = 0; y < height; y++) {
      pixels[y] = [];
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        pixels[y][x * 4] = imageData.data[i];
        pixels[y][x * 4 + 1] = imageData.data[i + 1];
        pixels[y][x * 4 + 2] = imageData.data[i + 2];
        pixels[y][x * 4 + 3] = imageData.data[i + 3];
      }
    }
    return pixels;
  };

  const convertToColoredAscii = (pixels: number[][], width: number, height: number): ColoredChar[][] => {
    const result: ColoredChar[][] = [];
    for (let y = 0; y < height; y++) {
      result[y] = [];
      for (let x = 0; x < width; x++) {
        const r = pixels[y][x * 4];
        const g = pixels[y][x * 4 + 1];
        const b = pixels[y][x * 4 + 2];
        const intensity = (r + g + b) / 3;
        result[y].push({
          char: getAsciiChar(intensity),
          color: rgbToHex(r, g, b)
        });
      }
    }
    return result;
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Error: Canvas context not available');
      setLoading(false);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      const pixels = getPixelsFromCanvas(ctx, width, height);
      const coloredAscii = convertToColoredAscii(pixels, width, height);
      setAsciiArt(coloredAscii);
      setLoading(false);
    };

    img.onerror = () => {
      setError('Error loading image');
      setLoading(false);
    };

    img.src = imageUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, width, height]);

  if (loading) return <div className={className}>Loading...</div>;
  if (error) return <div className={className}>{error}</div>;

  return (
    <pre className={`font-mono text-xs whitespace-pre ${className}`}>
      {asciiArt.map((row, i) => (
        <div key={i} style={{ lineHeight: '1em' }}>
          {row.map((col, j) => (
            <span key={`${i}-${j}`} style={{ color: col.color }}>
              {col.char}
            </span>
          ))}
        </div>
      ))}
    </pre>
  );
};

export default AsciiArt; 