import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Task from "./pages/Task";

function App() {
	return (
		<Router>
			<Switch>
				<Route exact path="/" component={Task} />
			</Switch>
		</Router>
	);
}

export default App;
