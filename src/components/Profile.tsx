import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import request from '../utils/makeRequest';
import ReactLoading from 'react-loading';

const Profile:React.FC = (props: any) => {

    const [loading, setLoading] = useState<boolean>(false);
     // TODO: Set up a user entity
    const [user, setUser] = useState<{username: string, firstName: string, lastName: string}>({username: "", firstName: "", lastName: ""});

    useEffect(() => {
        // request('GET', `users/profile`, {}, {})
        //     .then((res: any) => {
        //         console.log(res.data)
        //         setLoading(false)
        //     })
        //     .catch(err => {
        //         setLoading(false)
        //     })
    }, [])

    return(
    <div className='user-profile'>
        {loading? <ReactLoading className="user-access-loader" type={"spin"} color={"yellow"}/> :
            <>
            <h1>Username: {user.username}</h1>
            <h1>Name: {user.firstName} {user.lastName}</h1>
            </>}
    </div>
    )
}

export default Profile;