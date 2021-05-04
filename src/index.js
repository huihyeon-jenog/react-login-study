import { AppContainer } from "react-hot-loader";
import React from "react";
import ReactDOM from "react-dom";
import Root from "./Root";
import "./index.css";
import configureStore from "./redux/configureStore";

const store = configureStore();
const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component store={store} />
    </AppContainer>,
    document.getElementById("root")
  );
};

render(Root);

if (module.hot) {
  module.hot.accept("./Root", () => render(Root));
}
