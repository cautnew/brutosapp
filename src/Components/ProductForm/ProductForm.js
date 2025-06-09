import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import IconButton from "@material-ui/core/IconButton";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Chip from "@material-ui/core/Chip";

import api from "../../services/api";
import { Divider } from "@material-ui/core";

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
    marginTop: theme.spacing(2),
  },
}));

export default function SignUp({
  product,
  handleOnClickActionSubmit,
  handleOnClickActionCancel,
  title,
  actionSubmitText,
}) {
  const classes = useStyles();
  const [categoryList, setCategoryList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [branchListSelected, setBranchListSelected] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [minQuantity, setMinQuantity] = useState("");
  const [unitValue, setUnitValue] = useState("");
  const [isPackOfBread, setIsPackOfBread] = useState(false);
  const [data, setData] = useState({
    name: "",
    categoryId: 0,
  });

  useEffect(() => {
    if (product) {
      setData(product);
      setBranchListSelected(product.branchs);
      setUnitValue(product.unitValue);
      if (product.name.toString().toUpperCase().includes("PÃO")) {
        setIsPackOfBread(true);
      }
    }
  }, [product]);

  useEffect(() => {
    api.get("/branchs").then((res) => {
      setBranchList(res.data);
    });
    api.get("categories").then((res) => {
      setCategoryList(res.data);
      // if (!data.categoryId)
      // handleChangeData({ target: { id: "categoryId", value: res.data[0].id } });
    });
    return () => {};
  }, []);

  const handleChangeData = (e) => {
    setData((prevState) => ({ ...prevState, [e.target.id]: e.target.value }));
  };
  const handleChangeCategoryId = (e) => {
    setData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };
  const handleChangeBranchId = (e) => {
    setBranchId(e.target.value);
  };
  const handleChangeMinQuantity = (e) => {
    setMinQuantity(e.target.value);
  };
  const handleChangeMinQuatityBranch = (e) => {
    if (
      branchListSelected.length &&
      branchListSelected.map((e) => e.branchId).includes(branchId)
    ) {
      const branchlistSelectedUpdated = branchListSelected.map((e) => {
        if ((e.branchId = branchId)) return { ...e, minQuantity };

        return e;
      });

      return setBranchListSelected(branchlistSelectedUpdated);
    }

    const data = {
      branchId,
      branchName: branchList.find((elem) => elem.id == branchId).name,
      minQuantity,
    };

    const branch = [...branchListSelected, data];
    // console.log("data", branch);
    setBranchListSelected(branch);
    setMinQuantity("");
    setBranchId("");
  };
  const textMinQuantity = (quantity) => {
    if (isPackOfBread) {
      const numberOfBreadsPerPack = 8;
      const numberOfPacks = Math.floor(quantity / numberOfBreadsPerPack);
      const modNumberOfPacks = quantity % numberOfBreadsPerPack;

      if (modNumberOfPacks > 0) {
        return `${quantity} (${numberOfPacks}/${modNumberOfPacks})`;
      }

      return `${quantity} (${numberOfPacks})`;
    }

    return quantity;
  };
  const handleDeleteBranch = (branchId) => {
    setBranchListSelected((prevState) =>
      prevState.filter((e) => e.branchId != branchId)
    );
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5" style={{ width: "100%" }}>
          {title}
        </Typography>
        <form
          className={classes.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleOnClickActionSubmit({
              ...data,
              branchs: branchListSelected,
              unitValue,
            });
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
            <Grid item xs={12} sm={6}>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                fullWidth
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  Categoria
                </InputLabel>
                <Select
                  value={data.categoryId}
                  onChange={handleChangeCategoryId}
                  name="categoryId"
                  label="Cetegoria"
                >
                  {categoryList.map((e) => (
                    <MenuItem key={e.id} value={e.id}>
                      {e.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                value={unitValue}
                onChange={(e) => {
                  setUnitValue(e.target.value);
                }}
                autoComplete="fname"
                name="unitPrice"
                variant="outlined"
                required
                fullWidth
                id="unitPrice"
                label="Preço unitário"
                autoFocus
              />
            </Grid>

            <Divider style={{ width: "100%", margin: "8px" }} />
            <Grid xs={12} style={{ marginLeft: "8px" }}>
              <Typography variant="subtitle1">
                Adicione a quantidade mínima para cada filial
              </Typography>
            </Grid>

            {/* <div
              style={{
                width: "100%",
                margin: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            > */}
            <Grid item xs={12} sm={5}>
              <FormControl
                variant="outlined"
                className={classes.formControl}
                fullWidth
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  Filial
                </InputLabel>
                <Select
                  disabled={branchList.length == 0}
                  value={branchId}
                  onChange={handleChangeBranchId}
                  name="companyBranchId"
                  label="Filial"
                >
                  <MenuItem key={0} value={""}>
                    Selecione a filial
                  </MenuItem>
                  {branchList.map((e) => (
                    <MenuItem key={e.id} value={e.id}>
                      {e.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                type="number"
                value={minQuantity}
                onChange={handleChangeMinQuantity}
                variant="outlined"
                required
                fullWidth
                id="minQuantity"
                label="Quantidade mínima"
                name="minQuantity"
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                // className={classes.submit}
                onClick={handleChangeMinQuatityBranch}
              >
                {branchId &&
                branchListSelected.length &&
                branchListSelected.map((e) => e.branchId).includes(branchId)
                  ? "Editar"
                  : "Adicionar"}
              </Button>
            </Grid>
            {branchListSelected.length ? (
              <Grid item xs={12}>
                <Typography
                  style={{ marginTop: "16px", color: "rgba(0, 0, 0, 0.70)" }}
                  component="h6"
                  variant="h6"
                >
                  Quantidade mínima por filial:
                </Typography>
              </Grid>
            ) : null}

            <Grid xs={12} style={{}}>
              {branchListSelected.length ? (
                <List
                  component="nav"
                  className={classes.root}
                  aria-label="contacts"
                >
                  {branchListSelected.map((e) => (
                    <ListItem
                      button
                      onClick={() => {
                        handleChangeBranchId({
                          target: { value: e.branchId },
                        });
                        handleChangeMinQuantity({
                          target: { value: e.minQuantity },
                        });
                      }}
                      style={{ display: "flex", flexWrap: "wrap" }}
                    >
                      <ListItemText primary={e.branchName} />
                      <div>
                        <Chip
                          style={{ marginBottom: "8px" }}
                          label={textMinQuantity(e.minQuantity)}
                          color={"primary"}
                        />
                        <IconButton
                          onClick={() => handleDeleteBranch(e.branchId)}
                          edge="end"
                          aria-label="comments"
                          style={{ marginBottom: "8px", zindex: "9999999999" }}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </div>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography
                  style={{
                    marginTop: "16px",
                    marginLeft: "8px",
                    color: "rgba(0, 0, 0, 0.70)",
                  }}
                  component="h6"
                  variant="h6"
                >
                  Nenhuma quantidade minima por filial cadastrada
                </Typography>
              )}
            </Grid>

            <Divider style={{ width: "100%", margin: "8px" }} />
            {/* </div> */}
          </Grid>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
              onClick={handleOnClickActionCancel}
            >
              Voltar
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
