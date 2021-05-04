import React, { Component } from "react";
import { Route } from "react-router-dom";
import { Home, Auth } from "./pages";

export class App extends Component {
  render() {
    return (
      <div>
        <Route exact path="/" component={Home} />
        <Route exact path="/auth" component={Auth} />
      </div>
    );
  }
}

export default App;
