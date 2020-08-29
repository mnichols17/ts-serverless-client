import axios from 'axios';

// promise type?

export default async(route: string, headers?: object) => new Promise((resolve, reject) => {
    const url = process.env.NODE_ENV !== "production"? "http://10.0.0.12:5000/" : "https://jdlmoviedb.xyz/";
    axios({
        method: "GET",
        url: url + route,
        headers: headers
    })
    .then(res => resolve(res))
    .catch(err => reject("CONNECTION FAIL"))  
})