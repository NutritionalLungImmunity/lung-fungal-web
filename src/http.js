import axios from 'axios';

const http = axios.create({
  baseURL: 'https://data.nutritionallungimmunity.org/api/v1/',
});

export default http;
