import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import request from '../utils/makeRequest';
import ReactLoading from 'react-loading';

const Login:React.FC = (props: any) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const schema = yup.object().shape({
        user: yup.string().trim().required("Please enter information in each field").min(3, "Invalid email").max(255),
        password: yup.string().trim().required("Please enter information in each field").min(3, "Invalid password").max(255),
    })  

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
                console.log(res.data.msg)
                setLoading(false)
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
        {loading? <ReactLoading className="user-access-loader" type={"spin"} color={"yellow"}/> :
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

export default Login;