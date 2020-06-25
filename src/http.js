import axios from 'axios';

const http = axios.create({
  baseURL: 'https://data.kitware.com/api/v1/',
});

export default http;
