import "./App.css";
import CreateLink from "./CreateLink";
import Header from "./Header";
import LinkList from "./LinkList";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "./Login";
import Search from "./Search";

function App() {
  return (
    <div className="center w85">
      <Header />
      <div className="ph3 pv1 background-gray">
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/news/1" />} />
          <Route exact path="/create" component={CreateLink} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/search" component={Search} />
          <Route exact path="/top" component={LinkList} />
          <Route exact path="/news/:page" component={LinkList} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
