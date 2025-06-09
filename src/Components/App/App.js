import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Routes from "../../Routes";
import { UserContextProvider } from "../../Context/User/context";
import ErrorContextProvider from "../../Context/Error/context";

import { MuiPickersUtilsProvider } from '@material-ui/pickers';

// pick a date util library
import DateFnsUtils from '@date-io/date-fns';

import "./App.css";

function App() {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className="App">
      <UserContextProvider>
        <ErrorContextProvider>
          <Router>
            <Routes />
          </Router>
        </ErrorContextProvider>
      </UserContextProvider>
      </div>
    </MuiPickersUtilsProvider>
  );
}

export default App;
