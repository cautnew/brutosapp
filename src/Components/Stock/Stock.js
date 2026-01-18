import {
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  TextField,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { makeStyles } from "@material-ui/core/styles";
import SaveIcon from "@material-ui/icons/Save";
import KeyboardReturnIcon from "@material-ui/icons/KeyboardReturn";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import { Search } from "@material-ui/icons";

import { ErrorContext } from "../../Context/Error/context";

import { getToken } from "../../services/auth";

const useStyles = makeStyles({
  table: {
    minWidth: 200,
  },
});

function todayDate() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();

  return (yyyy + "-" + mm + "-" + dd);
}

const COLUMNS_DEFAULT = [
  { name: "Produto", key: "productName" },
  { name: "Quantidade Anterior", key: "previousQuantity" },
];

const COLUMNS_ADMIN = [
  { name: "Produto", key: "productName" },
  { name: "Quantidade de Entrada", key: "entryQuantity" },
  { name: "Quantidade de Saída", key: "quantitySold" },
  { name: "O que comprar", key: "missingQuantity" },
  { name: "Quantidade Final", key: "finalQuantity" },
  { name: "Última atualização", key: "userNameLastUpdate" },
  { name: "Quantidade do PDV", key: "pdvQuantity" },
  { name: "Diferença de quantidade", key: "differenceQuantity" },
  { name: "Quantidade Anterior", key: "previousQuantity" },
];

const COLUMNS_PERMISSION_UPDATE_FINAL_QUANTITY = [
  { name: "Quantidade Final", key: "finalQuantity" },
  { name: "Quantidade de Entrada", key: "entryQuantity" },
];
const COLUMNS_PERMISSION_SHOW_PRODUCTS_TO_DELIVERY = [
  { name: "O que comprar", key: "missingQuantity" },
];
const COLUMNS_PERMISSION_UPDATE_PDV_QUANTITY = [
  { name: "Quantidade do PDV", key: "pdvQuantity" },
];

export default function Stock({
  isAdmin,
  branchs: branchsPermissions,
  IsCentralStockAdmin,
}) {
  const [branchList, setBranchList] = useState([]);
  const [items, setItems] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [product, setProduct] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("list");
  const [colunms, setColunms] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [date, setDate] = useState(todayDate());

  const { handleChangeErrorState } = React.useContext(ErrorContext);

  useEffect(() => {
    if (isAdmin || IsCentralStockAdmin) {
      setBranchList(
        branchsPermissions.map((e) => ({
          name: e.CompanyBranchName,
          id: e.CompanyBranchId,
        }))
      );
      const CompanyBranchId = branchsPermissions[0].CompanyBranchId;
      setBranchId(CompanyBranchId);
      setLoading(true);
      api
        .get(
          `products/stock-daily?day=${todayDate()}&branchId=${CompanyBranchId}`
        )
        .then(({ data }) =>
          setItems(data.map((e) => ({ ...e, confirmEntryQuantity: false })))
        )
        .catch((err) => console.error("@@@", err))
        .finally(() => setLoading(false));
    } else {
      setBranchList(
        branchsPermissions
          .filter(
            (e) =>
              e.Permissions.includes("UpdateFinalQuantity") ||
              e.Permissions.includes("UpdatePdvQuantity")
          )
          .map((e) => ({
            name: e.CompanyBranchName,
            id: e.CompanyBranchId,
          }))
      );
      setBranchId(branchsPermissions[0].CompanyBranchId);
      setLoading(true);
      api
        .get(
          `products/stock-daily?day=${todayDate()}&branchId=${
            branchsPermissions[0].CompanyBranchId
          }`
        )
        .then(({ data }) =>
          setItems(data.map((e) => ({ ...e, confirmEntryQuantity: false })))
        )
        .catch((err) => console.error("@@@", err))
        .finally(() => setLoading(false));
    }
    return () => {};
  }, [IsCentralStockAdmin, isAdmin, branchsPermissions]);

  useEffect(() => {
    if (isAdmin || IsCentralStockAdmin) setColunms(COLUMNS_ADMIN);
    else setColunms(getColumnsByPermissions(branchsPermissions[0].Permissions));
  }, [IsCentralStockAdmin, isAdmin, branchsPermissions]);

  const getContent = (value) => {
    if (value === "end_stock") {
      setItems((prevState) =>
        prevState.map((e) => ({
          ...e,
          error: false,
        }))
      );
    } else if (value === "list") {
      setLoading(true);
      api
        .get(`products/stock-daily?day=${date}&branchId=${branchId}`)
        .then(({ data }) =>
          setItems(data.map((e) => ({ ...e, confirmEntryQuantity: false })))
        )
        .catch((err) => console.error("@@@", err))
        .finally(() => setLoading(false));
    } else if (value === "checklist") {
      setLoading(true);
      api
        .get("/branchs/checklist")
        .then(({ data }) =>
          setChecklist(data.map((e) => ({ ...e, confirmed: false })))
        )
        .catch((err) => console.error("@@@", err))
        .finally(() => setLoading(false));
    }

    setContent(value);
  };

  const getColumnsByPermissions = (permissions) => {
    const columns = [...COLUMNS_DEFAULT];

    permissions.includes("UpdateFinalQuantity") &&
      columns.push(...COLUMNS_PERMISSION_UPDATE_FINAL_QUANTITY);

    permissions.includes("ShowProductsToDelivery") &&
      columns.push(...COLUMNS_PERMISSION_SHOW_PRODUCTS_TO_DELIVERY);

    permissions.includes("UpdatePdvQuantity") &&
      columns.push(...COLUMNS_PERMISSION_UPDATE_PDV_QUANTITY);

    return columns;
  };

  const handleChangeBranchId = (e) => {
    const { value } = e.target;

    if (!isAdmin && !IsCentralStockAdmin) {
      const permissions = branchsPermissions.find(
        ({ CompanyBranchId }) => CompanyBranchId === value
      ).Permissions;
      setColunms(getColumnsByPermissions(permissions));
    }

    setLoading(true);
    api
      .get(`products/stock-daily?day=${todayDate()}&branchId=${value}`)
      .then(({ data }) =>
        setItems(data.map((e) => ({ ...e, confirmEntryQuantity: false })))
      )
      .catch((err) => console.error("@@@", err))
      .finally(() => setLoading(false));
    setBranchId(value);
  };

  const validData = (value) => {
    return true;
  };

  const handleSave = () => {
    const isValid = validData();
    if (!isValid) return;

    setLoading(true);
    let data = {
      entryQuantity: product.entryQuantity,
      finalQuantity: product.finalQuantity,
      previousQuantity: product.previusQuantity,
      pdvQuantity: product.pdvQuantity,
    };

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    };

    fetch(
      `https://danielbrutos-001-site1.ftempurl.com/api/products/stock-daily/${product.id}?branchId=${branchId}`,
      requestOptions
    )
      .then(async (response) => {
        if (response.status === 400) {
          const { errors: message } = await response.json();
          return handleChangeErrorState({
            error: true,
            message,
            type: "error",
          });
        }

        getContent("list");
      })
      .catch((err) => console.error("@@@ err", err))
      .finally((err) => setLoading(false));
  };

  const validDataFinalSock = () => {
    // const errorList = items.map((e) => e.error);

    const listOfValidatedItems = items.map((item) => {
      let error = false;
      if (
        (item.finalQuantity !== 0 && !item.finalQuantity) ||
        parseInt(item.finalQuantity) < 0
      )
        error = true;
      return { ...item, error };
    });

    setItems(listOfValidatedItems);

    const errorList = listOfValidatedItems.map((e) => e.error);
    if (errorList.includes(true)) {
      const firstItemOnTheListInError = listOfValidatedItems.find(
        (item) => item.error
      );

      let messageError = "";
      if (
        !firstItemOnTheListInError.finalQuantity &&
        firstItemOnTheListInError.finalQuantity !== 0
      )
        messageError =
          "ATENÇÂO: O campo de quantidade final nao pode estar vazio";
      else if (parseInt(firstItemOnTheListInError.finalQuantity) < 0)
        messageError =
          "ATENÇÂO: A campo de quantidade final deve ser maior que zero(0)";

      handleChangeErrorState({
        error: true,
        message: messageError,
        type: "error",
      });
      return false;
    }

    return true;
  };

  const handleSaveFinalStock = () => {
    const isValid = validDataFinalSock();

    if (!isValid) return;

    setLoading(true);
    api
      .put(`products/stock-daily/close-day?branchId=${branchId}`, {
        finalQuantities: items.map((e) => ({
          id: e.id,
          finalQuantity: parseInt(e.finalQuantity),
          confirmEntryQuantity: e.confirmEntryQuantity
            ? e.confirmEntryQuantity
            : false,
        })),
      })
      .then(({ data }) => {
        getContent("list");
      })
      .catch((err) => console.error(err))
      .finally((err) => setLoading(false));
  };

  const lineButtonDenseTable = () => {
    if (isAdmin || IsCentralStockAdmin) return true;

    if (
      branchsPermissions.length &&
      branchsPermissions
        .find((e) => e.CompanyBranchId === branchId)
        .Permissions.includes("UpdateFinalQuantity")
    )
      return false;
    else if (
      branchsPermissions
        .find((e) => e.CompanyBranchId === branchId)
        .Permissions.includes("UpdatePdvQuantity")
    )
      return true;
  };

  const handleChangeChecklist = (id) => {
    setChecklist((prevState) =>
      prevState.map((state) => {
        if (state.id === id) return { ...state, confirmed: !state.confirmed };

        return state;
      })
    );
  };

  const getContentComponent = (value) => {
    let component;
    switch (value) {
      case "list":
        component = (
          <Container
            maxWidth="lg"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <header
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <FormControl
                  variant="outlined"
                  style={{ minWidth: "250px", padding: "8px" }}
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    Filial
                  </InputLabel>
                  <Select
                    value={branchId}
                    name="branchId"
                    label="Produto"
                    onChange={handleChangeBranchId}
                    variant="outlined"
                    id="branchId"
                    required
                    fullWidth
                    autoFocus
                  >
                    {branchList.map((e) => (
                      <MenuItem key={e.id} value={e.id}>
                        {e.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {isAdmin && (
                  <>
                    <TextField
                      value={date}
                      onChange={(e) => {
                        if (
                          Date.parse(e.target.value) > Date.parse(todayDate())
                        )
                          return setDate(todayDate());
                        setDate(e.target.value);
                      }}
                      variant="outlined"
                      id="date"
                      label="Data"
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      style={{ padding: "9px" }}
                      required
                    />
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        api
                          .get(
                            `products/stock-daily?day=${date}&branchId=${branchId}`
                          )
                          .then(({ data }) =>
                            setItems(
                              data.map((e) => ({
                                ...e,
                                confirmEntryQuantity: false,
                              }))
                            )
                          )
                          .catch((err) => console.error("@@@", err))
                          .finally(() => setLoading(false));
                      }}
                      startIcon={<Search />}
                    >
                      Buscar
                    </Button>
                  </>
                )}
              </div>
              {(isAdmin ||
                (!IsCentralStockAdmin &&
                  branchsPermissions.length &&
                  branchId &&
                  branchsPermissions
                    .find((e) => e.CompanyBranchId === branchId)
                    .Permissions.includes("UpdateFinalQuantity"))) && (
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    href="#contained-buttons"
                    size="medium"
                    onClick={() => getContent("end_stock")}
                  >
                    Finalizar estoque
                  </Button>
                </div>
              )}
            </header>

            {colunms.length && items.length ? (
              <DenseTable
                colunms={colunms}
                rows={items}
                setRowSelected={setRowSelected}
                lineButton={lineButtonDenseTable()}
              />
            ) : null}
          </Container>
        );
        break;
      case "edit":
        component = (
          <Container component="main" maxWidth="sm">
            <Typography
              variant="h6"
              style={{
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {product.productName}
            </Typography>
            <Grid container spaces={2}>
              {isAdmin ? (
                <>
                  <Grid item xs={12}>
                    <TextField
                      style={{ marginBottom: "16px" }}
                      type="number"
                      value={product.entryQuantity}
                      onChange={(e) =>
                        setProduct((prevState) => ({
                          ...prevState,
                          entryQuantity: e.target.value,
                        }))
                      }
                      autoComplete="fname"
                      name="entryQuantity"
                      variant="outlined"
                      id="entryQuantity"
                      label="Quantidade de Entrada"
                      required
                      fullWidth
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      style={{ marginBottom: "16px" }}
                      type="number"
                      value={product.finalQuantity}
                      onChange={(e) =>
                        setProduct((prevState) => ({
                          ...prevState,
                          finalQuantity: e.target.value,
                        }))
                      }
                      autoComplete="fname"
                      name="finalQuantity"
                      variant="outlined"
                      id="finalQuantity"
                      label="Quantidade Final"
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      type="number"
                      style={{ marginBottom: "16px" }}
                      value={product.previusQuantity}
                      onChange={(e) =>
                        setProduct((prevState) => ({
                          ...prevState,
                          previusQuantity: e.target.value,
                        }))
                      }
                      autoComplete="fname"
                      name="entryQuantity"
                      variant="outlined"
                      id="entryQuantity"
                      label="Quantidade Anterior"
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      autoFocus
                      style={{ marginBottom: "16px" }}
                      type="number"
                      value={product.pdvQuantity}
                      onChange={(e) =>
                        setProduct((prevState) => ({
                          ...prevState,
                          pdvQuantity: e.target.value,
                        }))
                      }
                      autoComplete="fUpdatePdvQuantity"
                      name="pdvQuantity"
                      variant="outlined"
                      id="pdvQuantity"
                      label="Quantidade do PDV"
                      required
                      fullWidth
                    />
                  </Grid>
                </>
              ) : (
                <>
                  {IsCentralStockAdmin && (
                    <Grid item xs={12}>
                      <TextField
                        style={{ marginBottom: "16px" }}
                        type="number"
                        value={product.entryQuantity}
                        onChange={(e) =>
                          setProduct((prevState) => ({
                            ...prevState,
                            entryQuantity: e.target.value,
                          }))
                        }
                        autoComplete="fname"
                        name="entryQuantity"
                        variant="outlined"
                        id="entryQuantity"
                        label="Quantidade de Entrada"
                        required
                        fullWidth
                        autoFocus
                      />
                    </Grid>
                  )}
                  {branchsPermissions.find((e) => e.CompanyBranchId === branchId)
                    .Permissions &&
                  branchsPermissions.find((e) => e.CompanyBranchId === branchId)
                    .Permissions.length &&
                  branchsPermissions
                    .find((e) => e.CompanyBranchId === branchId)
                    .Permissions.includes("UpdatePdvQuantity") ? (
                    <Grid item xs={12}>
                      <TextField
                        autoFocus
                        style={{ marginBottom: "16px" }}
                        type="number"
                        value={product.pdvQuantity}
                        onChange={(e) =>
                          setProduct((prevState) => ({
                            ...prevState,
                            pdvQuantity: e.target.value,
                          }))
                        }
                        autoComplete="fUpdatePdvQuantity"
                        name="pdvQuantity"
                        variant="outlined"
                        required
                        fullWidth
                        id="pdvQuantity"
                        label="Quantidade do PDV"
                      />
                    </Grid>
                  ) : null}
                </>
              )}

              <Grid item xs={12} sm={6}>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  // className={classes.submit}
                  style={{ marginRight: "8px" }}
                  onClick={() => getContent("list")}
                >
                  Voltar
                </Button>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={{ marginLeft: "8px" }}
                  // className={classes.submit}
                  onClick={() => handleSave()}
                >
                  Salvar
                </Button>
              </Grid>
            </Grid>
          </Container>
        );
        break;
      case "end_stock":
        component =
          items && items.length ? (
            <Container maxWidth="md" style={{ overflowY: "auto" }}>
              <Typography style={{ width: "100%" }} variant="h6">
                Finalizar Estoque
              </Typography>
              <Divider style={{ margin: "16px 0" }} />
              <div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    position: "static",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ marginRight: "8px" }}
                    startIcon={<KeyboardReturnIcon />}
                    onClick={() => getContent("list")}
                  >
                    Voltar
                  </Button>
                  <Button
                    disabled={items
                      .map((e) => e.confirmEntryQuantity)
                      .includes(false)}
                    variant="contained"
                    color="primary"
                    style={{ marginLeft: "8px" }}
                    endIcon={<SaveIcon />}
                    onClick={() => {
                      const isValid = validDataFinalSock();

                      if (!isValid) return;

                      getContent("checklist");
                    }}
                  >
                    Salvar
                  </Button>
                </div>
                <div
                  style={{ height: "calc(100% - 112px)", overflowY: "auto" }}
                >
                  {items.map((elem, i) => (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "24px",
                        width: "100%",
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        style={{ marginBottom: "16px" }}
                      >
                        {elem.productName}
                      </Typography>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                        }}
                      >
                        <TextField
                          type="number"
                          id={i}
                          error={elem.error}
                          style={{ maxWidth: "200px" }}
                          value={elem.finalQuantity}
                          onChange={(e) =>
                            setItems((prevState) => {
                              let itemsState = [...prevState];

                              let error = true;
                              if (
                                e.target.value.length &&
                                parseInt(e.target.value) >= 0
                              )
                                error = !error;

                              itemsState[e.target.id].error = error;
                              itemsState[e.target.id].finalQuantity =
                                e.target.value;

                              setItems(itemsState);
                            })
                          }
                          autoComplete="fname"
                          name="finalQuantity"
                          variant="standard"
                          label="Quantidade de final"
                          required
                          fullWidth
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              onChange={(e) =>
                                setItems((prevState) => {
                                  let itemsState = [...prevState];

                                  itemsState[e.target.id].confirmEntryQuantity =
                                    !prevState[e.target.id]
                                      .confirmEntryQuantity;
                                  setItems(itemsState);
                                })
                              }
                              checked={elem.confirmEntryQuantity}
                              // onChange={handleChange}
                              name="confirmEntryQuantity"
                              id={i}
                              color="primary"
                            />
                          }
                          label={`Confirmar quantidade entrada de ${elem.entryQuantity}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Container>
          ) : null;
        break;
      case "checklist":
        component = (
          <Container maxWidth="md" style={{ overflowY: "auto" }}>
            <Typography style={{ width: "100%" }} variant="h6">
              Confirme e certifique-se de ter cumprido as tarefas
            </Typography>
            <Divider style={{ margin: "16px 0" }} />
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                position: "static",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                style={{ marginRight: "8px" }}
                startIcon={<KeyboardReturnIcon />}
                onClick={() => getContent("list")}
              >
                Cancelar
              </Button>
              <Button
                disabled={checklist.map((e) => e.confirmed).includes(false)}
                variant="contained"
                color="primary"
                style={{ marginLeft: "8px" }}
                endIcon={<DoubleArrowIcon />}
                onClick={handleSaveFinalStock}
              >
                Pronto
              </Button>
            </div>
            <div style={{ overflowY: "auto" }}>
              <DenseTable
                colunms={[
                  { name: "Tarefas", key: "name" },
                  { name: "Concluído", key: "checkbox" },
                ]}
                rows={checklist.map((e) => ({
                  ...e,
                  checkbox: (
                    <Checkbox
                      color="primary"
                      inputProps={{ "aria-label": "Checkbox demo" }}
                      onChange={() => handleChangeChecklist(e.id)}
                    />
                  ),
                }))}
              />
            </div>
          </Container>
        );
        break;
      default:
        break;
    }

    return component;
  };

  const setRowSelected = (id) => {
    const format = (value) => (value === 0 ? "" : value);
    if (isAdmin) {
      setLoading(true);
      api
        .get(`products/stock-daily/${id}?branchId=${branchId}`)
        .then(({ data }) =>
          setProduct({
            ...data,
            previusQuantity: format(data.previusQuantity),
            finalQuantity: format(data.finalQuantity),
            entryQuantity: format(data.entryQuantity),
          })
        )
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setProduct(items.find((e) => e.id === id));
    }

    getContent("edit");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        marginTop: "48px",
      }}
    >
      {!loading ? (
        // content == "end_stock" ? (
        //   <EndStock items={items} changeContent={() => getContent("list")} setItems={setItems} />
        // ) : (
        getContentComponent(content)
      ) : (
        // )
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

function DenseTable({ colunms, rows, setRowSelected, lineButton }) {
  const classes = useStyles();

  const txtQtdProducts = (quantity) => {
    if (quantity === undefined) {
      return 0;
    }

    const numberOfBreadsPerPack = 8;
    const numberOfPacks = Math.floor(quantity / numberOfBreadsPerPack);
    const modNumberOfPacks = quantity % numberOfBreadsPerPack;

    if (modNumberOfPacks > 0) {
      return `${quantity} (${numberOfPacks}/${modNumberOfPacks})`;
    }

    return `${quantity} (${numberOfPacks})`;
  };

  return (
    <Container
      masWidth="lg"
      style={{
        marginTop: "24px",
        width: "100%",
        overflowX: "auto",
        padding: "0px",
        maxHeight: "440px",
      }}
    >
      <Table
        stickyHeader
        className={classes.table}
        size="small"
        aria-label="a dense table"
      >
        <TableHead>
          <TableRow>
            {colunms.map((e, i) => (
              <TableCell
                key={e.key}
                align={
                  i === 0
                    ? "left"
                    : i === colunms.length - 1
                    ? "right"
                    : "center"
                }
              >
                {e.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const isPackOfBread = row.productName.toString().toUpperCase().includes("PÃO");
            return (
                <TableRow
                    button={lineButton}
                    hover
                    onClick={lineButton ? (e) => setRowSelected(row.id) : null}
                    key={row.id}
                >
                  {colunms.map((e, i) => {
                    const valCell = row[e.key] === undefined ? 0 : row[e.key];
                    return (
                        <TableCell
                            key={i}
                            component="th"
                            scope="row"
                            align={
                              i === 0
                                  ? "left"
                                  : i === colunms.length - 1
                                      ? "right"
                                      : "center"
                            }
                        >
                          {isPackOfBread && i > 0 ? txtQtdProducts(valCell) : valCell}
                        </TableCell>
                    )
                  })}
                </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Container>
  );
}
