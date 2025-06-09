import React from "react";

const UserContext = React.createContext(null);

const DEFAULT_VALUE = {
  state: {
    userName: "",
    userId: "",
    isAdmin: "false",
    branchs: "[]",
    nbf: null,
    exp: null,
    iat: null,
  },
};

const UserContextProvider = ({ children }) => {
  const [state, setState] = React.useState(DEFAULT_VALUE.state);

  const handleChangeState = (value) => setState(value);
  const handleChangeBranches = (value) => setState(prevState =>({...prevState, branches: value}));

  return (
    <UserContext.Provider value={{ state, handleChangeState, handleChangeBranches }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContextProvider };
export default UserContext;
