import axios from 'axios';

// promise type?

export default async(route: string, headers?: object) => new Promise((resolve, reject) => {
    axios({
        method: "GET",
        url: "http://localhost:5000/" + route,
        headers: headers
    })
    .then(res => resolve(res))
    .catch(err => reject("CONNECTION FAIL"))  
})