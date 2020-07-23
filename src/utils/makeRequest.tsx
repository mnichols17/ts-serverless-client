import axios from 'axios';

// promise type?

export default async(route: string, headers?: object) => new Promise((resolve, reject) => {
    console.log(route, headers);
    axios({
        method: "GET",
        url: "http://10.0.0.12:5000/" + route, // DEVELOPMENT
        //url: "https://jdlmoviedb.xyz/" + route, // PRODUCTION
        headers: headers
    })
    .then(res => resolve(res))
    .catch(err => reject("CONNECTION FAIL"))  
})