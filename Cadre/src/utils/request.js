import axios from 'axios';

console.log(process.env.BACKEND_PORT);
const port = process.env.BACKEND_PORT || 5001; // Sử dụng 5001 nếu không có PORT được đặt
const request = axios.create({ baseURL: `http://localhost:${port}` });
export default request;