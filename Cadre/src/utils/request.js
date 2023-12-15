import axios from 'axios';

const request = axios.create({ baseURL: `http://localhost:${process.env.port}/api/` });

export default request;