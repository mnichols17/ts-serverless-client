import React, {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import request from '../utils/makeRequest';
import ReactLoading from 'react-loading';


export const EmailConfirmed:React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const {id} = useParams();

    //@TODO Make sure confirmation code is legit
    useEffect(() => {
        request('GET', `users/confirm/${id}`, {}, {})
            .then((res: any) => {
                console.log(res.data)
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
            })
    }, [])

    return(
    <div id="registration-confirmed">
        {loading? <ReactLoading className="user-access-loader" type={"spin"} color={"yellow"}/> :
            <>
                <h3>Email Confirmed! Sign-in to start using your account</h3>
                <Link to='/'>Return Home</Link>
            </>}
    </div>
    )
}

export const Registration:React.FC = () => {

    const [created, setCreated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordCheck, setCheck] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [firstName, setFirst] = useState<string>("");
    const [lastName, setLast] = useState<string>("");
    const [error, setError] = useState<string>("");

    const schema = yup.object().shape({
        email: yup.string().trim().min(3, "Email must contain at least 3 characters").max(255).email("Please enter a valid email address"),
        username: yup.string().trim().min(3, "Username must contain at least 3 characters").max(100).matches(/^[a-zA-Z1-9_.-]+$/, "Please use only valid characters in your username"),
        firstName: yup.string().trim().min(1, "First name must contain at least 1 character").max(255),
        lastName: yup.string().trim().min(1, "Last name must contain at least 1 character").max(255),
        password: yup.string().trim().min(8, "Password must contain at least 8 characters").max(255),
        passwordCheck: yup.string().trim().oneOf([yup.ref('password')], 'Passwords must match')
    })  

    const onSubmit = (e: any) => {
        setLoading(true)
        e.preventDefault();
        schema.validate({
            email,
            username,
            firstName,
            lastName,
            password,
            passwordCheck
        })
        .then((data:any) => {
            setError("")
            request('POST', 'users/register', {}, data)
            .then(async(res: any) => {
                setLoading(false)
                setCreated(true);
            })
            .catch(err => {
                setError("User already exists with that email and/or username. Please try again")
                setLoading(false)
            })
        })
        .catch((err:any) => {
            setError(err.errors[0])
            setLoading(false)
        })
    }

    return(
    <div className="user-access">
        {loading? <ReactLoading className="user-access-loader" type={"spin"} color={"yellow"}/> :
            created? <>
                <h4>Account successfully created</h4>
                <h4>Confirm your email to being using your account</h4>
                <Link to="/">Return Home<FontAwesomeIcon icon={faAngleDoubleRight} color={'white'}/></Link>
            </>
            : <>
                <h3>Create your account</h3>
                {error.length ? <p>{error}</p> : null}
                <form className="user-form" onSubmit={onSubmit} >
                    <label>First Name
                        <input type="text" value={firstName} onChange={e => setFirst(e.target.value)} />
                    </label>
                    <label>Last Name
                        <input type="text" value={lastName} onChange={e => setLast(e.target.value)} />
                    </label>
                    <label>Username
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                    </label>
                    <label>Email
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </label>
                    <label>Password
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                        <p><FontAwesomeIcon className='register-icon' icon={faInfoCircle} />Password must contain at least 8 characters</p>
                        </label>
                    <label>Verify Password
                        <input type="password" value={passwordCheck} onChange={e => setCheck(e.target.value)} />
                    </label>
                    <br/>
                    <button className="title-font">Register Account</button>
                    <h5>Already have an account? <Link to="/login">Sign In</Link></h5>
                </form>
            </>}
    </div>
    )
}