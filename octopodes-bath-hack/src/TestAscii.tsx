'use client';

import AsciiArt from './AsciiArt';

const TestAscii = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">ASCII Art Test</h1>
      <div className="space-y-8">
        {/* Small size test */}
        <div>
          <h2 className="text-xl mb-2">Small Size (50x25)</h2>
          <AsciiArt 
            imageUrl="https://robohash.org/test1?size=200x200"
            width={50}
            height={25}
            className="bg-black text-green-400 p-4 rounded"
          />
        </div>

        {/* Medium size test */}
        <div>
          <h2 className="text-xl mb-2">Medium Size (100x50)</h2>
          <AsciiArt 
            imageUrl="https://robohash.org/test2?size=300x300"
            width={100}
            height={50}
            className="bg-black text-yellow-400 p-4 rounded"
          />
        </div>

        {/* Large size test */}
        <div>
          <h2 className="text-xl mb-2">Large Size (150x75)</h2>
          <AsciiArt 
            imageUrl="https://robohash.org/test3?size=400x400"
            width={150}
            height={75}
            className="bg-black text-blue-400 p-4 rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default TestAscii; 