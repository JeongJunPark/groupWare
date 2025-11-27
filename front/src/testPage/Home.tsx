import React, { useState, useEffect } from "react";
import CallAPI from "../testApi/CallAPI";
import axios from 'axios';


const Home: React.FC = () => {
  const [city, setCity] = useState("Seoul");
  const [data, setData] = useState<any>(null);

  const handleFetch = async () => {
    try {
      const res = await CallAPI(city);
      setData(res);
    } catch (err) {
      console.error(err);
    }
  };

  type User = {
    id: number;
    name: string;
    email: string;
  };

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("access_token"); // 로그인 후 저장한 JWT
        
        console.log(token);
        const res = await axios.get<User[]>(`http://172.19.1.21:4000/users`, {
        // const res = await axios.get<User[]>(`http://localhost:4000/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);


  return (
    <div>
      <input
        type="text"
        placeholder="region"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={handleFetch}>Fetch Weather</button>
      <br/>
      <br/>
    <div>
      <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black' }}>No.</th>
            <th style={{ border: '1px solid black' }}>Name</th>
            <th style={{ border: '1px solid black' }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td style={{ border: '1px solid black' }}>{user.id}</td>
              <td style={{ border: '1px solid black' }}>{user.name}</td>
              <td style={{ border: '1px solid black' }}>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>      

      {data && (
        <div>
          <p>Temperature: {data.main.temp}°C</p>
          <p>Description: {data.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
