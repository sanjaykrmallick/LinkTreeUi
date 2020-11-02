import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "../node_modules/@coreui/coreui/dist/css/coreui.min.css";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";
import "./App.scss";
import SignUp from "./pages/signup-page";
import LoginPage from "./pages/login-page";
import ForgotPasswordPage from "./pages/forgot-password-page";
import DefaultLayout from "./containers/DefaultLayout/DefaultLayout";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import ProtectedRoute from "./components/protected-routes";
import PublicRoute from "./components/public-route";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div></div>} persistor={persistor}>
        <Router>
          <div>
            <ToastsContainer
              store={ToastsStore}
              position={ToastsContainerPosition.BOTTOM_RIGHT}
            />
            <Switch>
              <Route
                exact
                path='/signup'
                component={SignUp}
                redirectUrl='/links'
              />
              <Route exact path='/login' component={LoginPage} />
              <Route
                exact
                path='/forgot-password'
                component={ForgotPasswordPage}
              />
              <ProtectedRoute
                exact
                path='/login'
                render={() => <Redirect to='/login' />}
              />

              <Route path='/' component={DefaultLayout} />
              <PublicRoute path='*' render={() => <Redirect to='/' />} />
            </Switch>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
