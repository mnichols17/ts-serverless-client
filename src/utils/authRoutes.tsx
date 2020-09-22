import React, { useState, useEffect, useContext} from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps} from 'react-router-dom';
import makeRequest from './makeRequest';
import { SearchContext } from './context';

const AuthRoute: React.FC<RouteProps> = (props: RouteProps) => {

    const {loggedIn, checkAuth} = useContext(SearchContext);
    const[data, setData] = useState<any>(false);
    const {component, ...rest} = props;

    useEffect(() => {
        // console.log("LOGGED IN", loggedIn, "CHECKING", checkAuth)
        if(!checkAuth) setData({user: loggedIn})
    }, [checkAuth, loggedIn])

    const renderRoute = (routeProps: RouteComponentProps) => {
        // console.log("RENDER PROPER ROUTE", data)
        // loading screen?
        if(!data) return null

        // Check for auth route data? and return to redirect
        if(!data.user) return <Redirect to='/login' />

        const Component = component as any;
        return <Component {...routeProps} />
    }

	return (<Route {...rest} component={renderRoute} />)
}

export default AuthRoute;