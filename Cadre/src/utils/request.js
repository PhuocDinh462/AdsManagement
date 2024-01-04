import axios from 'axios';

const port = process.env.REACT_APP_BACKEND_PORT; // Sử dụng 5001 nếu không có PORT được đặt
const request = axios.create({ baseURL: `http://localhost:${port}` });
export default request;

