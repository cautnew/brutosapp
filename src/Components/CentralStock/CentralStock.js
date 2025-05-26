import React, { useState, useEffect, useContext } from "react";
import { Container, Divider, Typography } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { AddBox, Search } from "@material-ui/icons";
import KeyboardReturnIcon from "@material-ui/icons/KeyboardReturn";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import CssBaseline from "@material-ui/core/CssBaseline";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";

import VisibilityIcon from "@material-ui/icons/Visibility";

import UserContext from "../../Context/User/context";

import ProductQuantityInAllBranches from "./ProductQuantityInAllBranches";

import api from "../../services/api";

function todayDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  return (today = yyyy + "-" + mm + "-" + dd);
}

function formatDate(date) {
  return `${date.split("-")[2].split("T")[0]}/${date.split("-")[1]}/${
    date.split("-")[0]
  }`;
}

function todayDateSumeOne(value, operation) {
  var date = new Date(value);
  if (operation && operation === "sub") date.setDate(date.getDate() - 2);
  else date.setDate(date.getDate() + 2);

  var dd = String(date.getDate()).padStart(2, "0");
  var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = date.getFullYear();

  return yyyy + "-" + mm + "-" + dd;
}

export default function CentralStock() {
  const [loading, setLoading] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [merchandiseList, setMerchandiseList] = useState([]);
  const [productId, setProductId] = useState("");
  const [valueSpended, setvalueSpended] = useState("");
  const [quantity, setQuantity] = useState("");
  const [startDate, setStartDate] = useState(todayDate());
  const [endDate, setEndDate] = useState(todayDateSumeOne(todayDate()));
  const [description, setDescription] = useState("");
  const [available, setAvailable] = useState("");
  const [total, setTotal] = useState("");
  const [hide, setHide] = useState(true);
  const [showHide, setShowHide] = useState(false);
  const [merchandise, setMerchandise] = useState({
    productId: "",
    quantity: 0,
    valueSpended: 0,
  });
  const [content, setContent] = useState("list");

  const userContext = useContext(UserContext);

  useEffect(() => {
    setLoading(true);
    api
      .get("products")
      .then(({ data }) => {
        if (data.length) {
          api
            .get(
              `/products/central-stock?StartDate=${todayDate()}&EndDate=${todayDateSumeOne(
                todayDate()
              )}&ProductId=${data[0].id}&showHide=${showHide}`
            )
            .then((response) => {
              setMerchandiseList(response.data.items);
              setTotal(response.data.total);
            })
            .catch((err) => console.error("@@@ err", err))
            .finally(() => setLoading(false));
        }
        setProductsList(data);
        setProductId(data[0].id);
      })
      .catch((err) => console.error("@@@ err", err))
      .finally(() => {
        setLoading(false);
      });
    return () => {};
  }, []);

  const handleChangeContent = (value) => {
    if (value === "list") {
      setMerchandise({
        productId: "",
        quantity: "",
        valueSpended: "",
      });
      setTotal("");

      setLoading(true);
      api
        .get(
          `/products/central-stock?StartDate=${startDate}&EndDate=${endDate}&ProductId=${productId}&showHide=${showHide}`
        )
        .then((response) => {
          setMerchandiseList(response.data.items);
          setTotal(response.data.total);
        })
        .catch((err) => console.error("@@@ err", err))
        .finally(() => setLoading(false));
    } else if (value === "see_all") {
      setLoading(true);
      api
        .get(`/products/central-stock/available`)
        .then((response) => {
          setAvailable(response.data);
        })
        .catch((err) => console.error("@@@ err", err))
        .finally(() => setLoading(false));
    }

    setContent(value);
  };

  const handleChangeProduct = (value) => {
    setLoading(true);
    api
      .get(
        `/products/central-stock?StartDate=${startDate}&EndDate=${endDate}&ProductId=${value}&showHide=${showHide}`
      )
      .then((response) => {
        setMerchandiseList(response.data.items);
        setTotal(response.data.total);
      })
      .catch((err) => console.error("@@@ err", err))
      .finally(() => setLoading(false));
    setProductId(value);
  };

  const handleChangeStartDate = (e) => {
    if (Date.parse(e.target.value) > Date.parse(todayDate()))
      return setStartDate(todayDate());
    setStartDate(e.target.value);

    if (endDate && Date.parse(e.target.value) > Date.parse(endDate))
      return setEndDate(todayDateSumeOne(e.target.value));
  };

  const handleChangeEndDate = (e) => {
    if (Date.parse(e.target.value) > Date.parse(todayDate()))
      return setEndDate(todayDate());
    setEndDate(e.target.value);

    if (startDate && Date.parse(e.target.value) < Date.parse(startDate))
      return setStartDate(todayDateSumeOne(e.target.value, "sub"));
  };

  const searchMerchandise = (_) => {
    setLoading(true);
    api
      .get(
        `/products/central-stock?StartDate=${startDate}&EndDate=${endDate}&ProductId=${productId}&showHide=${showHide}`
      )
      .then((response) => {
        setMerchandiseList(response.data.items);
        setTotal(response.data.total);
      })
      .catch((err) => console.error("@@@ err", err))
      .finally(() => setLoading(false));
  };

  const handleCreateMerchandise = () => {
    setLoading(true);
    api
      .post("/products/central-stock", {
        productId,
        quantity,
        valueSpended,
        description,
        hide,
      })
      .then(() => {
        handleChangeContent("list");
      })
      .catch(() => {
        handleChangeContent("list");
      })
      .finally(() => setLoading(false));
  };

  const getContentComponent = (value) => {
    let component;
    switch (value) {
      case "list":
        component = (
          <SimpleTable
            colunmList={[
              { name: "Produto", key: "productName" },
              { name: "Quantidade", key: "quantity" },
              { name: "Preço unitário", key: "unitValue" },
              { name: "Descrição", key: "description" },
              { name: "Dia", key: "day" },
            ]}
            list={merchandiseList.map((merchandise) => ({
              ...merchandise,
              day: formatDate(merchandise.day),
            }))}
          />
        );
        break;
      case "create":
        component = (
          <Container component="main" maxWidth="sm">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5" style={{ width: "100%" }}>
                Criar Mercadoria
              </Typography>
              <form
                style={{ width: "100%", marginTop: "24px" }}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateMerchandise();
                }}
                noValidate
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="demo-simple-select-outlined-label">
                        Produto
                      </InputLabel>
                      <Select
                        value={productId}
                        name="productId"
                        label="Produto"
                        value={productId}
                        onChange={(e) => {
                          setProductId(e.target.value);
                        }}
                        name="product"
                        variant="outlined"
                        required
                        fullWidth
                        id="productId"
                        label="Produto"
                        autoFocus
                      >
                        {productsList.map((e) => (
                          <MenuItem key={e.id} value={e.id}>
                            {e.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      autoComplete="fname"
                      name="description"
                      variant="outlined"
                      required
                      fullWidth
                      id="description"
                      label="Descrição"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      autoComplete="fname"
                      name="quantity"
                      variant="outlined"
                      required
                      fullWidth
                      id="quantity"
                      label="Quantidade"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="number"
                      value={valueSpended}
                      onChange={(e) => setvalueSpended(e.target.value)}
                      variant="outlined"
                      required
                      fullWidth
                      id="valueSpended"
                      label="Valor gasto"
                      name="valueSpended"
                      autoComplete="lname"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          checked={hide}
                          onChange={(e) => {
                            setHide((x) => !x);
                          }}
                        />
                      }
                      label="Ocultar lançamento"
                    />
                  </Grid>
                </Grid>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    style={{ marginTop: "16px" }}
                    onClick={() => handleChangeContent("list")}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "16px" }}
                  >
                    Criar mercadoria
                  </Button>
                </div>
              </form>
            </div>
            <Box mt={5}></Box>
          </Container>
        );
        break;
      case "see_all":
        component = (
          <>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                style={{ marginRight: "8px" }}
                startIcon={<KeyboardReturnIcon />}
                onClick={() => handleChangeContent("list")}
              >
                Voltar
              </Button>
            </div>

            <SimpleTable
              colunmList={[
                { name: "Produto", key: "productName" },
                { name: "Total", key: "total" },
              ]}
              list={available}
            />
          </>
        );
        break;
      case "delete":
        component = {};
        break;
      // default:
      //   console.log("nada");
    }
    return component;
  };

  if (userContext.state.IsCentralStockAdmin)
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          // margin: "24px 0",
          overflow: "hidden",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              // marginBottom: '8px',
              flexWrap: "wrap",
            }}
          >
            <FormControl
              size="small"
              variant="outlined"
              style={{
                minWidth: "250px",
                marginRight: "8px",
                paddingBottom: "16px",
              }}
            >
              <InputLabel id="demo-simple-select-outlined-label">
                Produto
              </InputLabel>
              <Select
                value={productId}
                name="productId"
                label="Produto"
                value={productId}
                onChange={(e) => {
                  handleChangeProduct(e.target.value);
                }}
                name="product"
                variant="outlined"
                required
                fullWidth
                id="productId"
                label="Produto"
                autoFocus
              >
                {productsList.map((e) => (
                  <MenuItem key={e.id} value={e.id}>
                    {e.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <TextField
              size="small"
              value={startDate}
              onChange={handleChangeStartDate}
              variant="outlined"
              required
              id="date"
              label="Data Inicial"
              type="date"
              // className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginRight: "8px", paddingBottom: "16px" }}
            />
            <TextField
              size="small"
              value={endDate}
              onChange={handleChangeEndDate}
              variant="outlined"
              required
              id="date"
              label="Data Final"
              type="date"
              // className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginRight: "8px", paddingBottom: "16px" }}
            />
          </div>
          <Button
            type="button"
            variant="contained"
            color="primary"
            style={{ marginBottom: "16px" }}
            onClick={searchMerchandise}
            startIcon={<Search />}
          >
            Buscar
          </Button>
        </div>

        <div style={{ width: "100%", marginTop: "16px" }}>
          <Divider />
        </div>

        <ProductQuantityInAllBranches productId={productId} startDate={startDate} endDate={endDate} />
      </div>
    );

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "24px",
        margin: "24px 0",
        overflow: "hidden",
        alignItems: "center",
      }}
    >
      {!loading ? (
        <>
          {content === "list" ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                {/* {!merchandiseList.length ? null : ( */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    // marginBottom: '8px',
                    flexWrap: "wrap",
                  }}
                >
                  <FormControl
                    size="small"
                    variant="outlined"
                    style={{
                      minWidth: "250px",
                      marginRight: "8px",
                      paddingBottom: "16px",
                    }}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Produto
                    </InputLabel>
                    <Select
                      value={productId}
                      name="productId"
                      label="Produto"
                      value={productId}
                      onChange={(e) => {
                        handleChangeProduct(e.target.value);
                      }}
                      name="product"
                      variant="outlined"
                      required
                      fullWidth
                      id="productId"
                      label="Produto"
                      autoFocus
                    >
                      {productsList.map((e) => (
                        <MenuItem key={e.id} value={e.id}>
                          {e.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    size="small"
                    value={startDate}
                    onChange={handleChangeStartDate}
                    variant="outlined"
                    required
                    id="date"
                    label="Data Inicial"
                    type="date"
                    // className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    style={{ marginRight: "8px", paddingBottom: "16px" }}
                  />
                  <TextField
                    size="small"
                    value={endDate}
                    onChange={handleChangeEndDate}
                    variant="outlined"
                    required
                    id="date"
                    label="Data Final"
                    type="date"
                    // className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    style={{ marginRight: "8px", paddingBottom: "16px" }}
                  />
                  <div>
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          checked={showHide}
                          onChange={(e) => {
                            setShowHide((x) => !x);
                          }}
                        />
                      }
                      label="Mostrar lançamentos ocultos"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    style={{ marginBottom: "16px" }}
                    onClick={searchMerchandise}
                    startIcon={<Search />}
                  >
                    Buscar
                  </Button>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    href="#contained-buttons"
                    size="medium"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleChangeContent("see_all")}
                    style={{
                      width: "fit-content",
                    }}
                  >
                    Ver todos
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    href="#contained-buttons"
                    size="medium"
                    startIcon={<AddBox />}
                    onClick={() => handleChangeContent("create")}
                    style={{
                      width: "fit-content",
                    }}
                  >
                    Add Mercadoria
                  </Button>
                </div>
              </div>

              {userContext.state.isAdmin && (
                <div style={{ width: "100%", marginTop: "16px" }}>
                  <Divider />
                  <Typography
                    variant="subtitle2"
                    style={{
                      color: "rgba(0, 0, 0, 0.77)",
                      padding: "8px 0",
                      marginLeft: "8px",
                    }}
                  >
                    Estoque Central: {total}
                  </Typography>
                </div>
              )}

              <ProductQuantityInAllBranches productId={productId} startDate={startDate} endDate={endDate} />
            </>
          ) : null}
          {getContentComponent(content)}
        </>
      ) : (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <CircularProgress />
        </div>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  table: {
    width: "100%",
  },
}));

function SimpleTable({ list, colunmList }) {
  const classes = useStyles();
  // const [checked, setChecked] = React.useState([0]);
  // console.log("@@@ list", list);

  if (!list || !list.length) return null;
  // console.log("@@@ SimpleTable");
  return (
    <TableContainer
      component={Paper}
      style={{
        width: "100%",
        paddingLeft: "0px",
        margin: "10px 0px",
        padding: "0px",
        maxHeight: "440px",
      }}
    >
      <Table stickyHeader className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {colunmList.map((e, i) => (
              <TableCell
                align={
                  i === 0
                    ? "left"
                    : i === colunmList.length - 1
                    ? "right"
                    : "center"
                }
              >
                <Typography variant="subtitle1">{e.name}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((item) => (
            <TableRow key={item.name}>
              {colunmList.map((elem, i) => (
                <TableCell
                  align={
                    i === 0
                      ? "left"
                      : i === colunmList.length - 1
                      ? "right"
                      : "center"
                  }
                  component="th"
                  scope="row"
                >
                  <Typography variant="subtitle1">{item[elem.key]}</Typography>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
