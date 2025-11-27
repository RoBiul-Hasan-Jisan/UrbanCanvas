import axios from "axios";

const API_URL = "https://urbancanvas.onrender.com"; 

const custom = axios.create({
  baseURL: API_URL,
  headers: { Accept: "application/json" }
});

export default custom;
