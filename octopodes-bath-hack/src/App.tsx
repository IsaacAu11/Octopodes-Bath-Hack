// App.tsx
import { useState } from 'react';
import FrontPage from './pages/frontPage';
import MainPage from './pages/mainPage';

function App() {
  const [pageIndex, setPageIndex] = useState("frontPage");

  const handleEnter = (newPageIndex: string) => {
    setPageIndex(newPageIndex);
    console.log(`Page changed to: ${newPageIndex}`);
  };

  return (
    <>
      {pageIndex === 'frontPage' && <FrontPage onEnter={() => handleEnter('mainPage')} />}
      {pageIndex === 'mainPage' && <MainPage />}
    </>
  );
}

export default App;
