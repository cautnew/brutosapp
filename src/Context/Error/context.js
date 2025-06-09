import React from "react";

const ErrorContext = React.createContext();

function ErrorContextProvider(props) {
  const [state, setState] = React.useState({
    error: false,
    message: "",
    type: "",
  });

  const handleChangeErrorState = (data) => {
    setState(data);
  };

  const onClose = (data) => {
    setState({
      error: false,
      message: "",
      type: "",
    });
  };

  return (
    <ErrorContext.Provider value={{ handleChangeErrorState, state, onClose }}>
      {props.children}
    </ErrorContext.Provider>
  );
}

export { ErrorContext };
export default ErrorContextProvider;
