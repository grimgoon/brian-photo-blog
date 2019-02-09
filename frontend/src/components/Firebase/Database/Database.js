import axios from 'axios';
import config from '../Config/Config';

const instance = axios.create({
    baseURL : config.databaseURL
});

export default instance;

