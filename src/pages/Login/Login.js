import React from "react";
import { useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
// import Link from "@material-ui/core/Link";
// import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";

import UserContext from "../../Context/User/context";
import api from "../../services/api";
import { login, parseJwt } from "../../services/auth";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: "8px",
  },
  container: {
    display: "flex",
    alignItems: "center",
  },
}));

const DEFAULT_FIELDS_ERROR = {
  password: {
    error: false,
    message: "",
  },
  userName: {
    error: false,
    message: "",
  },
  accessCode: {
    error: false,
    message: "",
  },
};

export default function Login() {
  const classes = useStyles();
  let history = useHistory();
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fieldError, setFieldError] = React.useState(DEFAULT_FIELDS_ERROR);
  const [loginError, setLoginError] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [accessCodeLogin, setAccessCodeLogin] = React.useState(false);
  const [accessCode, setAccessCode] = React.useState("");

  const { handleChangeState: setUserContextState } =
    React.useContext(UserContext);

  const handleChangeUserName = (e) => {
    const userNameIsEmpty = userName.length === 0;
    if (userNameIsEmpty && fieldError.userName.error) {
      setFieldError((currentState) => ({
        ...currentState,
        userName: {
          error: false,
        },
      }));
    }

    setUserName(e.target.value);
  };

  const handleChangeAccessCode = (e) => {
    const codeIsEmpty = accessCode.length === 0;
    if (codeIsEmpty && fieldError.accessCode.error) {
      setFieldError((currentState) => ({
        ...currentState,
        accessCode: {
          error: false,
        },
      }));
    }

    setAccessCode(e.target.value.toUpperCase());
  };

  const handleChangePassword = (e) => {
    const passwordIsEmpty = password.length === 0;
    if (passwordIsEmpty && fieldError.password.error) {
      setFieldError((currentState) => ({
        ...currentState,
        password: {
          error: false,
        },
      }));
    }

    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (accessCodeLogin) {
      const codeIsEmpty = accessCode.length === 0;

      if (codeIsEmpty) {
        let newValueFieldError = {};
        if (codeIsEmpty)
          newValueFieldError["accessCode"] = {
            error: true,
            message: "Campo de código de acesso não pode estar vazio",
          };
        return setFieldError((prevState) => ({
          ...prevState,
          ...newValueFieldError,
        }));
      }
      setIsLoading(true);
      return api
        .post("/auth", { accessCode })
        .then(({ data }) => {
          login(data);
          setUserContextState(parseJwt(data));
          history.push("/");
        })
        .catch((error) => setLoginError(true))
        .finally(() => setIsLoading(false));
    }

    const userNameIsEmpty = userName.length === 0;
    const passwordIsEmpty = password.length === 0;

    if (userNameIsEmpty || passwordIsEmpty) {
      let newValueFieldError = {};
      if (userNameIsEmpty)
        newValueFieldError["userName"] = {
          error: true,
          message: "Campo nome do usuário não pode estar vazio",
        };
      if (passwordIsEmpty)
        newValueFieldError["password"] = {
          error: true,
          message: "Campo password não pode estar vazio",
        };
      return setFieldError((prevState) => ({
        ...prevState,
        ...newValueFieldError,
      }));
    }

    setIsLoading(true);
    return api
      .post("/auth", { nick: userName, password })
      .then(({ data }) => {
        login(data);
        setUserContextState(parseJwt(data));
        history.push("/");
      })
      .catch((error) => setLoginError(true))
      .finally(() => setIsLoading(false));
    // handleChangeState();
  };

  return (
    <Container className={classes.container} component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          {!accessCodeLogin ? (
            <>
              <TextField
                error={fieldError.userName.error}
                helperText={fieldError.userName.message}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="user-name"
                label="Usuario"
                name="userName"
                autoComplete="nome"
                onChange={handleChangeUserName}
                value={userName}
                autoFocus
              />
              <TextField
                error={fieldError.password.error}
                helperText={fieldError.password.message}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChangePassword}
                value={password}
              />
            </>
          ) : (
            <TextField
              error={fieldError.accessCode.error}
              helperText={fieldError.accessCode.message}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="accessCode"
              label="Código"
              id="accessCode"
              autoComplete="current-accessCode"
              onChange={handleChangeAccessCode}
              value={accessCode}
              style={{ textTransform: "uppercase" }}
            />
          )}

          {!isLoading ? (
            <div
              style={{
                width: "100%",
                height: "auto",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {!accessCodeLogin ? (
                <Button
                  style={{ cursor: "pointer", margin: 0 }}
                  variant="outlined"
                  color="primary"
                  onClick={() => setAccessCodeLogin(true)}
                  style={{ flex: 1 }}
                >
                  Código de acesso
                </Button>
              ) : (
                <Button
                  style={{ cursor: "pointer", margin: 0 }}
                  variant="outlined"
                  color="primary"
                  onClick={() => setAccessCodeLogin(false)}
                  style={{ flex: 1 }}
                >
                  Voltar
                </Button>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ flex: 1 }}
              >
                Entrar
              </Button>
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "8px",
              }}
            >
              <CircularProgress />
            </div>
          )}
        </form>
        {loginError && (
          <Alert style={{ width: "100%" }} severity="error">
            Usuário ou senha inválido
          </Alert>
        )}
      </div>
    </Container>
  );
}
