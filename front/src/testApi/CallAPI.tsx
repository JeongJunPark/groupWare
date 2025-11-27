// src/testApi/CallAPI.ts
import axios from "axios";

const API_KEY = "9fee6753d7aaf8466ae169341b7b389f";

interface Weather {
  description: string;
  icon: string;
}

export interface jsonData {
  weather: Weather[];
  main: {
    temp: number;
  };
}

const CallAPI = async (city: string): Promise<jsonData> => {
  try {
    const res = await axios.get<jsonData>(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    console.log("city: ", city);
    console.log("#################################");
    console.log("res: \n", res);
     
    return res.data;
  } catch (error) {
    console.error("Data Error!", error);
    throw error;
  } finally {
    console.log("The end");
  }
};

export default CallAPI;
