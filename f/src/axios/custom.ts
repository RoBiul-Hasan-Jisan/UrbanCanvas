// axios/custom.ts
import axios from "axios";

const customFetch = axios.create({
    baseURL: "http://localhost:5000", 
    headers: {
        Accept: "application/json"
    }
})

export default customFetch;