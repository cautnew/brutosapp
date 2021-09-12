import React, { useState, useEffect } from "react";
import { Divider, Typography } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { AddBox, Search } from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";

import api from "../../services/api";

function todayDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  return (today = yyyy + "-" + mm + "-" + dd);
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
    console.log("@@@ list", list);
  
    if (!list || !list.length) return null;
    console.log("@@@ SimpleTable");
    return (
      <TableContainer
        component={Paper}
        style={{ width: "100%", paddingLeft: "0px", margin: "10px 0px" }}
      >
        <Table className={classes.table} aria-label="simple table">
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

export default function ProductsByBranch() {
    const [loading, setLoading] = useState(false);
    const [branchList, setBranchList] = useState([]);
    const [branchId, setBranchId] = useState("");
    const [productsByBranch, setProductsByBranch] = useState([]);
    const [totalEntryQuantity, setTotalEntryQuantity] = useState("");
    const [totalOutQuantity, setTotalOutQuantity] = useState("");
    const [startDate, setStartDate] = useState(todayDate());
    const [endDate, setEndDate] = useState(todayDateSumeOne(todayDate()));
    const [content, setContent] = useState("list");

    useEffect(() => {
        setContent("list");
        setLoading(true);
        api
          .get("/branchs")
          .then(({ data }) => {
            setBranchList(data);
            setBranchId(data[0].id);
          })
          .finally(() => setLoading(false));
        setLoading(true);
        return () => {};
      }, []);

      const handleChangeBranchId = (e) => {
        const { value } = e.target;
        setBranchId(value);
      };

      const loadProductsByBranch = () => api
      .get(`reports?branchId=${branchId}&startDate=${new Date(startDate).toISOString().split('T')[0]}&endDate=${new Date(endDate).toISOString().split('T')[0]}`)
      .then(({ data }) => {
        setProductsByBranch(data);
        if(data && data.length)
        {
            setTotalEntryQuantity(0);
            setTotalOutQuantity(0);
            let currentTotalEntryQuantity = 0;
            for(var i=0; i < data.length; i++)
            {
                const entryQuantity = data[i].entryQuantity;
                if(entryQuantity > 0)
                {
                    currentTotalEntryQuantity += entryQuantity;
                }
            }
            let currentTotalOutQuantity = 0;
            for(var i=0; i < data.length; i++)
            {
                const outQuantity = data[i].outQuantity;
                if(outQuantity > 0)
                {
                    currentTotalOutQuantity += outQuantity;
                }
            }
            setTotalEntryQuantity(currentTotalEntryQuantity);
            setTotalOutQuantity(currentTotalOutQuantity);
            return;
        }
        setTotalEntryQuantity("");
        setTotalOutQuantity("");
        setContent("list");
      })
      .catch((err) => console.log("@@@ err", err))
      .finally(() => setLoading(false));

      const handleChangeStartDate = (e) => {
        setStartDate(e.target.value);
      };
    
      const handleChangeEndDate = (e) => {
        setEndDate(e.target.value);
      };

      const searchProductsBybranch = (_) => {
        setLoading(true);
        loadProductsByBranch();
      };

      const getContentComponent = (value) => {
        let component;
        switch (value) {
          case "list":
            component = (
              <SimpleTable
                colunmList={[
                  { name: "Data", key: "day" },
                  { name: "Nome", key: "productName" },
                  { name: "Quantidade que entrou", key: "entryQuantity" },
                  { name: "Quantidade que saiu", key: "outQuantity" }
                ]}
                list={productsByBranch}
              />
            );
            break;
          
          default:
            console.log("nada");
        }
        return component;
      };

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
                            justifyContent: "space-between",
                            alignItems: "center",
                            // marginBottom: '8px',
                            flexWrap: 'wrap'
                        }}
                    >
                    <FormControl
                        variant="outlined"
                        style={{ minWidth: "250px", marginRight: "8px", paddingBottom: "16px" }}
                    >
                        <InputLabel id="demo-simple-select-outlined-label">
                            Filial
                        </InputLabel>
                        <Select
                            value={branchId}
                            name="branchId"
                            label="Filial"
                            value={branchId}
                            onChange={handleChangeBranchId}
                            name="branch"
                            variant="outlined"
                            required
                            fullWidth
                            id="branchId"
                            autoFocus
                        >
                            {branchList.map((e) => (
                            <MenuItem key={e.id} value={e.id}>
                                {e.name}
                            </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                                
                        <TextField
                    value={startDate}
                    onChange={handleChangeStartDate}
                    variant="outlined"
                    required
                    id="date"
                    label="Data Inicial"
                    type="date"
                    defaultValue="2017-05-24"
                    // className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    style={{ marginRight: "8px",  paddingBottom: "16px" }}
                  />
                  <TextField
                    value={endDate}
                    onChange={handleChangeEndDate}
                    variant="outlined"
                    required
                    id="date"
                    label="Data Final"
                    type="date"
                    defaultValue="2017-05-24"
                    format="dd/MM/yyyy"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    style={{ marginRight: "8px",  paddingBottom: "16px" }}
                  />
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    style={{ marginBottom: "16px" }}
                    onClick={searchProductsBybranch}
                    startIcon={<Search />}
                  >
                    Buscar
                  </Button>
                    </div>
                </>
              ) : null}
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
                  TOTAL DE ENTRADAS: {totalEntryQuantity}
                </Typography>
                <Divider />
              </div>
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
                  TOTAL DE SAÍDAS: {totalOutQuantity}
                </Typography>
                <Divider />
              </div>
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
};