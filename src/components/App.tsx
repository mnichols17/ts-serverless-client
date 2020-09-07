import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

import Home from './Home';
import ReviewPage from './Review';
import RandomPage from './Random';
// import {Registration, EmailConfirmed} from './Registration';
// import {Login} from './Login';

const App: React.FC = () => {
	return (
		<Router>
			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/review/:rank" component={ReviewPage} />
				<Route path="/random" component={RandomPage} />
				{/* <Route path="/login" component={Login} />
				<Route path="/register" component={Registration} />
				<Route path="/confirm/:code" component={EmailConfirmed} /> */}
				<Redirect to="/" />
			</Switch>
		</Router>
	)
}

export default App;
