import React, {useState, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import request from '../utils/makeRequest';
import ReactLoading from 'react-loading';
import { SearchContext } from '../utils/context';

export const Logout:React.FC = (props: any) => {

    const {loggedIn, currentAuth, checkAuth, resetPage} = useContext(SearchContext);
    const [valid, setValid] = useState<boolean>(false);
    const[leavingLogout, setLeaving] = useState<NodeJS.Timeout | undefined>();

    useEffect(() => {
        if(!loggedIn && !checkAuth){
            props.history.push('/login')
        } else {
            request('POST', 'users/logout', {}, {})
            .then(async(res: any) => {
                console.log("SUCCESS LOGOUT")
                setValid(true);
                currentAuth(false);
                resetPage();
                setLeaving(setTimeout(() => props.history.push('/'), 1000))
            })
            .catch(err => {
                console.log("NO LOGOUT")
                props.history.push('/')
            })
        }

    }, [checkAuth])


    return(
        valid? <div className='user-access'>
            <h3>Logout Successful!</h3>
            <p>Redirecting you home now</p>
        </div> : <></>
    )
}

export const Login:React.FC = (props: any) => {

    const {loggedIn, checkAuth, currentAuth} = useContext(SearchContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const schema = yup.object().shape({
        user: yup.string().trim().required("Please enter information in each field").min(3, "Invalid email").max(255),
        password: yup.string().trim().required("Please enter information in each field").min(3, "Invalid password").max(255),
    })  

    useEffect(() => {
        if(loggedIn && !checkAuth) {
            props.history.replace('/')
            props.history.push('/profile')
        }
    }, [checkAuth])

    const onSubmit = (e: any) => {
        e.preventDefault();
        schema.validate({
            user,
            password
        })
        .then((data:any) => {
            setLoading(true)
            setError("")
            request('POST', 'users/login', {}, data)
            .then(async(res: any) => {
                currentAuth(true);
                props.history.push('/profile')
            })
            .catch(err => {
                setError(err)
                setLoading(false)
            })
        })
        .catch((err:any) => {
            setError(err.errors[0])
        })
    }

    return(
    <div className='user-access'>
        {checkAuth || loading? <ReactLoading className="user-access-loader" type={"spin"} color={"yellow"}/> :
            <>
                <h3>Log in</h3>
                {error.length ? <p>{error}</p> : null}
                <form id="login-form" className="user-form" onSubmit={onSubmit} >
                    <label>Username/Email
                        <input type="text" value={user} onChange={e => setUser(e.target.value)} />
                    </label>
                    <label>Password
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </label>
                    <br/>
                    <button className="title-font">Sign In</button>
                    <h5>Dont have an account? <Link to="/register">Register Now</Link></h5>
                </form>
            </>}
    </div>
    )
}