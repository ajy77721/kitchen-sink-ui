import axios from "axios";


const API_BASE_URL ="http://localhost:8080/kitchen-sink";
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Create an Axios Client with defaults
const ApiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  // Intercept requests to include JWT token in headers
  ApiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('userToken');
      if ( !(token==='undefined' || token ==null)) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  export default ApiClient;
  