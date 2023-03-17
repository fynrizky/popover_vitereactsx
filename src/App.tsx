import React, { useEffect, useState } from 'react';
import PageMenu from './components/PageMenu';
import axios from 'axios';


interface Todo {
  id: number;
  name: string;
  type: string;
  desc: string;
  card_images: cardImages[];
}

interface cardImages {
  id: number;
  image_url: string;
  image_url_small: string;
}

const Home: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_YGOPRODECK_API!}`);
        const data = response.data.data;
        console.log(data)
        const todos = Array.isArray(data) ? data.slice(0, 12532) : [];
        setTodos(todos);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: '#C8C8C8', display:'flex', justifyContent:'center', alignItems:'center', }}>
      <div style={{ backgroundColor: '#FFFFFF', position:'relative', maxWidth:'70vh', minWidth: '45vh', minHeight: '100vh'}}>
        <PageMenu todos={todos} />
      </div>
    </div>
  );
};

export default Home;