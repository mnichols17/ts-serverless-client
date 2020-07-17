import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

import Home from './Home';
import Review from './Review';

const App: React.FC = () => {
	return (
		<Router>
			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/review/:movie" component={Review} />
				<Redirect to="/" />
			</Switch>
		</Router>
	)
}

export default App;
