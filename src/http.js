import axios from 'axios';

const http = axios.create({
  baseURL: 'https://data.computational-biology.org/api/v1/',
});

export default http;
