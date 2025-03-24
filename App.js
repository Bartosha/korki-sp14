import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('https://korki-sp14.onrender.com').then(response => {
      setData(response.data);
    });
  }, []);

  return (
    <div className="App">
      <h1>{data ? data : 'Ładowanie danych...'}</h1>
    </div>
  );
}

export default App;
