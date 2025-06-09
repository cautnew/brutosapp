import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Divider from "@material-ui/core/Divider";

import api from "../../services/api";

import SimpleList from "../SimpleList/SimpleList";
import UserContext from "../../Context/User/context";

const PERMISSIONS = [
  { id: "ShowProductsToDelivery", name: "Mostrar produtos para entrega" },
  { id: "UpdateFinalQuantity", name: "Atualizar a quantidade final" },
  { id: "UpdatePdvQuantity", name: "Atualizar a quantidade do PDV" },
  { id: "ReadReports", name: "Ler relatório" },
  { id: "ReadNotes", name: "Ler notas" },
];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: "100%",
    },
  },
};

const useStyles = makeStyles((theme) => ({
  paper: {
    // marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    marginTop: "16px",
  },
  formControl: {
    margin: "8px 0",
    minWidth: 120,
    // maxWidth: '100%',
    position: "relative",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

function getPathApi(id) {
  return `branchs/${id}/categories`;
}

export default function UsersForm({
  user,
  handleOnClickActionSubmit,
  handleOnClickActionCancel,
  title,
  actionSubmitText,
  isAdmin,
}) {
  const classes = useStyles();
  const { state } = React.useContext(UserContext);
  const [brancheList, setBrancheList] = useState([]);
  const [brancheInvalidList, setBrancheInvalidList] = useState([]);
  const [brancheId, setBranche] = useState("0");
  const [permissions, setPermissions] = useState([]);
  const [data, setData] = useState({
    name: "",
    branchs: [],
  });

  useEffect(() => {
    if (user) {
      setData(user);
    }
  }, [user]);

  // useEffect(() => {
  // if (data.branchs.length) {
  //   setBrancheInvalidList(data.branchs.map((e) => e.companyBranchId));
  // }
  // }, [data]);

  useEffect(() => {
    api.get("/branchs").then((res) => {
      setBrancheList(res.data);
    });
    return () => {};
  }, []);

  if (isAdmin)
    return (
      <Container component="main" maxWidth="sm">
        <div className={classes.paper}>
          <Typography
            component="h1"
            variant="h5"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItem: "center",
            }}
          >
            {title}
          </Typography>
          <form
            className={classes.form}
            onSubmit={(e) => {
              e.preventDefault();
              handleOnClickActionSubmit(data);
            }}
            noValidate
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  value={data.name}
                  onChange={(e) => setData(e.target.value)}
                  autoComplete="fname"
                  name="name"
                  variant="outlined"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                />
              </Grid>
            </Grid>

            <Divider style={{ margin: "16px 0px" }} />
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
                onClick={handleOnClickActionCancel}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                {actionSubmitText}
              </Button>
            </div>
          </form>
        </div>
        <Box mt={5}></Box>
      </Container>
    );

  const handleChangeData = (e) => {
    setData((prevState) => ({ ...prevState, [e.target.id]: e.target.value }));
  };
  const handleChangeBrancheId = (e) => {
    // if (data.branchs.length) {
    //   setBrancheInvalidList(data.branchs.map((e) => e.companyBranchId));
    // }

    setBranche(e.target.value);
    // setData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
    // setBranche(brancheList.find(y));;
    if (
      data.branchs.length != 0 &&
      data.branchs.map((e) => e.companyBranchId).includes(e.target.value)
    ) {
      setPermissions(
        data.branchs.find((elem) => elem.companyBranchId == e.target.value)
          .permissions
      );
    } else setPermissions([]);
  };

  const handleChangePermissions = (e) => {
    if (
      !e.target.value.length &&
      data.branchs.map((elem) => elem.companyBranchId).includes(brancheId)
    ) {
      const currentData = data;
      const objIndex = currentData.branchs.findIndex(
        (obj) => obj.companyBranchId == brancheId
      );
      currentData.branchs.splice(objIndex, 1);
      setData(currentData);
    }
    setPermissions(e.target.value);
  };

  const handleChangePermissionBranche = (e) => {
    if (!permissions.length || brancheId == "0") return;

    if (data.branchs && data.branchs.length) {
      if (data.branchs.map((elem) => elem.companyBranchId).includes(brancheId))
        return setData((prevData) => ({
          ...prevData,
          branchs: prevData.branchs.map((elem) => {
            if (elem.companyBranchId == brancheId)
              return { companyBranchId: brancheId, permissions };

            return elem;
          }),
        }));

      return setData((prevData) => ({
        ...prevData,
        branchs: [
          ...prevData.branchs,
          { companyBranchId: brancheId, permissions },
        ],
      }));
    }

    setData((prevData) =>
      setData({
        ...prevData,
        branchs: [{ companyBranchId: brancheId, permissions }],
      })
    );
    setPermissions([]);
    setBranche("0");
  };
  // console.log("@@@ data.branchs", data.branchs);
  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography
          component="h1"
          variant="h5"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItem: "center",
          }}
        >
          {title}
        </Typography>
        <form
          className={classes.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleOnClickActionSubmit(data);
          }}
          noValidate
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                value={data.name}
                onChange={handleChangeData}
                autoComplete="fname"
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
              <Typography
                style={{ marginTop: "16px", color: "rgba(0, 0, 0, 0.70)" }}
                component="h6"
                variant="h6"
              >
                Permissões por filiais:
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                fullWidth
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  Filial
                </InputLabel>
                <Select
                  value={brancheId}
                  onChange={handleChangeBrancheId}
                  name="companyBranchId"
                  label="Filial"
                >
                  <MenuItem key={0} value={"0"}>
                    Selecione a filial
                  </MenuItem>
                  {brancheList.map((e) => (
                    <MenuItem key={e.id} value={e.id}>
                      {e.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                fullWidth
              >
                <InputLabel id="demo-mutiple-chip-label">Permissões</InputLabel>
                <Select
                  multiple
                  value={permissions}
                  onChange={handleChangePermissions}
                  name="permissions"
                  input={<Input variant="outlined" id="select-multiple-chip" />}
                  renderValue={(selected) => (
                    <div className={classes.chips}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={PERMISSIONS.find((e) => e.id == value).name}
                          className={classes.chip}
                        />
                      ))}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {PERMISSIONS.map((e) => (
                    <MenuItem key={e.id} value={e.id}>
                      {e.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleChangePermissionBranche}
          >
            {brancheId &&
            data.branchs.length != 0 &&
            data.branchs.map((e) => e.companyBranchId).includes(brancheId)
              ? "Editar permissão"
              : "Adicionar permissão"}
          </Button>
          {data.branchs.length ? (
            <Grid item xs={12}>
              <Typography
                style={{ marginTop: "16px", color: "rgba(0, 0, 0, 0.70)" }}
                component="h6"
                variant="h6"
              >
                Permissões adicionadas:
              </Typography>
            </Grid>
          ) : null}
          <div style={{}}>
            {data.branchs.length ? (
              <List
                component="nav"
                className={classes.root}
                aria-label="contacts"
              >
                {data.branchs.map((e) => (
                  <ListItem
                    button
                    onClick={() =>
                      handleChangeBrancheId({
                        target: { value: e.companyBranchId },
                      })
                    }
                    style={{ display: "flex", flexWrap: "wrap" }}
                  >
                    <ListItemText
                      primary={
                        brancheList.length &&
                        brancheList.find((elem) => elem.id == e.companyBranchId)
                          .name
                      }
                    />
                    <div>
                      {e.permissions.map((permission) => (
                        <Chip
                          style={{ marginBottom: "8px" }}
                          label={
                            PERMISSIONS.find((PER) => PER.id == permission).name
                          }
                        />
                      ))}
                    </div>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography
                style={{ marginTop: "16px", color: "rgba(0, 0, 0, 0.70)" }}
                component="h6"
                variant="h6"
              >
                Nenhuma permissão por filial cadastrada
              </Typography>
            )}
          </div>
          <Divider style={{ margin: "16px 0px" }} />
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
              onClick={handleOnClickActionCancel}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {actionSubmitText}
            </Button>
          </div>
        </form>
      </div>
      <Box mt={5}></Box>
    </Container>
  );
}
