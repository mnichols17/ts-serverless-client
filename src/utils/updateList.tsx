import makeRequest from "./makeRequest";

export default (id: number, type: string, add:boolean) => {
    makeRequest('POST', 'users/lists', {}, {id, type, add})
    .then((res:any) => {
        console.log(res.data)
    })
    .catch(err => console.log(err))
}