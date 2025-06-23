import axios from "axios";

export default axios.create({ baseURL: '${process.env.EXPO_PUBLIC_BASE_URL}' });