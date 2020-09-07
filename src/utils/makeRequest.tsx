import axios from 'axios';

// promise type?

type Method = "GET" | "POST" | "PUT" | "DELETE";

export default async(type: Method, route: string, headers?: object, data?: object) => new Promise((resolve, reject) => {
    const url = process.env.NODE_ENV !== "production"? "http://10.0.0.12:5000/" : "https://jdlmoviedb.xyz/";
    axios({
        method: type,
        url: url + route,
        headers: headers,
        data
    })
    .then(res => {
        resolve(res)
    })
    .catch(err => {
        reject(err.response? err.response.data.error : "REQUEST FAIL")
    })  
})