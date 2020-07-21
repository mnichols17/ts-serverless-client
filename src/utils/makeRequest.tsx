import axios from 'axios';

// promise type?

export default async(route: string, headers?: object) => new Promise((resolve, reject) => {
    axios({
        method: "GET",
        //url: "http://10.0.0.12:5000/" + route, //web route -> url: "http://localhost:5000/" + route,
        url: "https://jdlmoviedb.xyz/" + route,
        headers: headers
    })
    .then(res => resolve(res))
    .catch(err => reject("CONNECTION FAIL"))  
})