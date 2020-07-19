import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

import Home from './Home';
import ReviewPage from './Review';

const App: React.FC = () => {
	return (
		<Router>
			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/review/:rank" component={ReviewPage} />
				<Redirect to="/" />
			</Switch>
		</Router>
	)
}

export default App;
