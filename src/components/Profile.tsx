import React, {useState, useEffect, useContext} from 'react';
import request from '../utils/makeRequest';
import ReactLoading from 'react-loading';
import { SearchContext } from '../utils/context';
import {User} from '../utils/entities';
import { Link } from 'react-router-dom';

const Profile:React.FC = (props: any) => {

    const {currentAuth} = useContext(SearchContext);
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User>({username: "", firstname: "", lastname: ""});

    useEffect(() => {
        request('GET', `users/profile`, {}, {})
            .then((res: any) => {
                setUser(res.data)
                setLoading(false)
            })
            .catch(err => {
                currentAuth(false);
                props.history.push('/')
            })
    }, [])

    return(
    <div className='user-profile'>
        {loading? <ReactLoading className="user-access-loader" type={"spin"} color={"yellow"}/> :
            <>
                <h1>{user.username}</h1>
                <h4>Name: {user.firstname} {user.lastname}</h4>
                <h4>Email: {user.email}</h4>
                <div id="profile-btn-group">
                    <Link className="profile-btn" to="/lists">Lists</Link>
                    <Link className="profile-btn" to="/logout">Logout</Link>
                </div>
            </>}
    </div>
    )
}

export default Profile;