import {
  Button,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TableContainer,
  TextField,
  Typography,
} from "@material-ui/core";
import { Print, SearchOutlined } from "@material-ui/icons";
import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

function todayDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  return (today = yyyy + "-" + mm + "-" + dd);
}

const ProductEntry = ({ branchs, isAdmin, isCentralStockAdmin }) => {
  const [loading, setLoading] = useState(false);
  const [branchList, setBranchList] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [startDate, setStartDate] = useState(todayDate());
  const [entrys, setEntrys] = useState([]);

  const tableRef = useRef();

  useEffect(() => {
    setLoading(true);
    if (isAdmin) {
      api
        .get("/branchs")
        .then(({ data }) => {
          setBranchList(data);
          setBranchId(data[0].id);
          getEntrys(data[0].id, todayDate());
        })
        .finally(() => setLoading(false));
    } else {
      setBranchList(
        branchs.map((e) => ({
          name: e.CompanyBranchName,
          id: e.CompanyBranchId,
        }))
      );
      setBranchId(branchs[0].CompanyBranchId);
    }
    setLoading(false);
    return () => {};
  }, [branchs, isAdmin]);

  const openPdf = (branchId, date) => {
    window.location.href = `https://danielbrutos-001-site1.ftempurl.com/api/products/entries/print?branchId=${branchId}&day=${date}`;
  };

  const getEntrys = async (branchId, date) => {
    setLoading(true);
    const data = await api.get(
      `/products/entries?branchId=${branchId}&day=${date}`
    );
    data?.data.length >= 0 && setEntrys(data.data);

    setLoading(false);
  };
  // console.log(entrys, !!entrys.length);

  const handleChangeBranchId = (e) => {
    const { value } = e.target;
    setBranchId(value);
    getEntrys(value, startDate);
  };

  const handleChangeStartDate = (e) => {
    const { value } = e.target;
    setStartDate(value);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "24px",
        }}
      >
        {!loading ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Entrada de produtos</Typography>

              <Button
                size="small"
                variant="outlined"
                color="primary"
                disabled={entrys.length === 0}
                onClick={() => openPdf(branchId, startDate)}
              >
                <Print />
              </Button>
            </div>
            <Divider style={{ margin: "1rem 0" }} />
            <div>
              <div>
                <FormControl
                  variant="outlined"
                  size="small"
                  style={{
                    minWidth: "10rem",
                    marginRight: "8px",
                    paddingBottom: "16px",
                  }}
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    Filial
                  </InputLabel>
                  <Select
                    name="branchId"
                    label="Filial"
                    value={branchId}
                    onChange={handleChangeBranchId}
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
                  size="small"
                  onChange={handleChangeStartDate}
                  variant="outlined"
                  required
                  id="date"
                  label="Data Inicial"
                  type="date"
                  disabled={isCentralStockAdmin}
                  defaultValue="2017-05-24"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ marginRight: "8px", paddingBottom: "16px" }}
                />
              </div>
            </div>
            <Button
              style={{ margin: "0" }}
              variant="contained"
              color="primary"
              size="small"
              onClick={() => getEntrys(branchId, startDate)}
            >
              <SearchOutlined />
              Buscar
            </Button>

            {!!entrys.length ? (
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
                <Table stickyHeader aria-label="simple table" ref={tableRef}>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle1">Nome</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle1">Quantidade</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entrys.map((item) => (
                      <TableRow key={item.name}>
                        <TableCell component="th" scope="row">
                          <Typography variant="subtitle1">
                            {item.productName}
                          </Typography>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <Typography variant="subtitle1">
                            {item.quantity}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="h6" color="primary">
                Nenhuma entrada encontrada
              </Typography>
            )}
          </>
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductEntry;
