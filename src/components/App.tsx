import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
// import AuthRoute from '../utils/authRoutes';

// import Header from './Header';
import Home from './Home';
import ReviewPage from './Review';
import RandomPage from './Random';
import HolidayPage from './Holiday';
// import {Registration, EmailConfirmed} from './Registration';
// import {Login, Logout} from './Auth';
// import Profile from './Profile';
// import UserLists from './UserLists';

const App: React.FC = () => {
	return (
		<Router>
			{/* <Header /> */}
			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/review/:rank" component={ReviewPage} />
				<Route path="/random" component={RandomPage} />
				<Route path="/holiday" component={HolidayPage} />
				{/* <Route path="/login" component={Login} />
				<Route path="/logout" component={Logout} />
				<Route path="/register" component={Registration} />
				<Route path="/confirm/:id" component={EmailConfirmed} />
				{/* <Route path="/profile" component={Profile} /> */}
				{/* <Route path="/lists" component={UserLists} />
				<AuthRoute path="/profile" component={Profile} />
				<AuthRoute path="/lists" component={UserLists} /> */}
				<Redirect to="/" />
			</Switch>
		</Router>
	)
}

export default App;
