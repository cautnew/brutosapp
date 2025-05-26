import React, { useState, useEffect } from "react";
import api from "../services/api";

import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";

import searchImg from "../assets/search-in-list-96.png";
import { setDate } from "date-fns";
import { SearchOutlined } from "@material-ui/icons";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

function LinearDeterminate({ inProgress }) {
  const classes = useStyles();
  const [progress, setProgress] = React.useState(0);
  const [timerId, setTimerId] = React.useState(null);

  React.useEffect(() => {
    const increment = 60 / 100;
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 99) {
          return;
        }

        return increment + oldProgress;
      });
    }, 500);

    setTimerId(timer);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={classes.root}>
      <LinearProgress variant="determinate" value={progress} />
    </div>
  );
}

const searchTypes = {
  ["ByEntryQuantity"]: "Quantidade de entrada",
  ["ByOutQuantity"]: "Quantidade de saída",
  ["ByDifferenceQuantity"]: "Quantidade de diferença",
  ["ByFinalQuantity"]: "Quantidade final",
  ["ByMissingQuantity"]: "O que comprar",
};

function getPreviousDay(date = new Date()) {
  const previous = new Date(date.getTime());
  previous.setDate(date.getDate() - 1);

  var dd = String(previous.getDate()).padStart(2, "0");
  var mm = String(previous.getMonth() + 1).padStart(2, "0");
  var yyyy = previous.getFullYear();

  return yyyy + "-" + mm + "-" + dd;
}

function todayDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  return (today = yyyy + "-" + mm + "-" + dd);
}

const Summary = ({ branchs, isCentralStockAdmin }) => {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(null);
  const [summary, setSummary] = useState([]);
  const [date, setDate] = useState(todayDate());
  const [researchQuantity, setResearchQuantity] = useState(0);

  useEffect(() => {
    if (researchQuantity) {
      const myTimeout = setTimeout(
        () => fetchSummaryWhileEmpty(myTimeout),
        50000
      );
    }
  }, [researchQuantity]);

  const branchList = React.useMemo(
    () =>
      branchs.map((e) => ({
        name: e.CompanyBranchName,
        id: e.CompanyBranchId,
      })),
    [branchs]
  );

  const getSummary = () => {
    setLoading(true);
    api
      .get(`/products/reports/summary?type=${type}&day=${date}`)
      .then(({ data }) => {
        if (!data.length) setResearchQuantity((prevState) => ++prevState);
        else {
          setSummary(data);
          setLoading(false);
        }
      })
      .catch((err) => new Error("line90"));
  };

  const fetchSummaryWhileEmpty = (myTimeout) => {
    setLoading(true);
    api
      .get(`/products/reports/summary?type=${type}&day=${date}`)
      .then(({ data }) => {
        if (!data.length) setResearchQuantity((prevState) => ++prevState);
        else {
          setSummary(data);
          clearTimeout(myTimeout);
          setLoading(false);
        }
      });
  };

  const searchTypeFilterOptions = ((searchTypeKeys) => {
    const optionsKey = isCentralStockAdmin
      ? searchTypeKeys.filter((key) => key !== "ByDifferenceQuantity")
      : searchTypeKeys;

    return optionsKey.map((key) => (
      <MenuItem key={key} value={key}>
        {searchTypes[key]}
      </MenuItem>
    ));
  })(Object.keys(searchTypes));
  // console.log("getPreviousDay", getPreviousDay());
  return (
    <>
      {loading ? (
        <LinearDeterminate />
      ) : (
        <Container>
          <Typography variant="h6" style={{ margin: "10px 0" }}>
            Resumo
          </Typography>

          <div
            style={{
              display: "flex",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            <FormControl
              variant="outlined"
              size="small"
              style={{
                minWidth: "10rem",
                maxWidth: "20rem",
                marginRight: "8px",
                paddingBottom: "16px",
              }}
              fullWidth
            >
              <InputLabel id="demo-simple-select-outlined-label">
                Buscar por
              </InputLabel>
              <Select
                value={type}
                name="productId"
                label="Buscar por"
                onChange={(e) => {
                  setType(e.target.value);
                }}
                placeholder="Selecione o tipo de busca"
                variant="outlined"
                required
              >
                {searchTypeFilterOptions}
              </Select>
            </FormControl>

            {isCentralStockAdmin ? (
              <FormControl
                variant="outlined"
                size="small"
                style={{
                  minWidth: "10rem",
                  maxWidth: "20rem",
                  marginRight: "8px",
                  paddingBottom: "16px",
                }}
                fullWidth
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  Dia
                </InputLabel>
                <Select
                  value={date}
                  label="Dia"
                  onChange={(e) => {
                    setDate(e.target.value);
                  }}
                  variant="outlined"
                  required
                >
                  <MenuItem value={todayDate()}>Hoje</MenuItem>
                  <MenuItem value={getPreviousDay()}>Ontem</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <TextField
                value={date}
                size="small"
                onChange={(e) => setDate(e.target.value)}
                variant="outlined"
                required
                id="date"
                label="Data"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          </div>

          <Button
            style={{
              marginBottom: "16px",
            }}
            variant="contained"
            color="primary"
            size="small"
            onClick={() => getSummary()}
            disabled={!type}
          >
            <SearchOutlined />
            Buscar
          </Button>
          {!type ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                marginLeft: "-24px",
                justifyContent: "center",
                position: "absolute",
                top: "50%",
                transform: "translate(0, -50%)",
              }}
            >
              <img
                src={searchImg}
                width="100"
                height={100}
                alt="Search illustration"
                style={{ color: "white" }}
              />
            </div>
          ) : (
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
              {summary.length ? (
                <Table stickyHeader aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle3">Nome</Typography>
                      </TableCell>
                      {branchList.map((branch) => (
                        <TableCell>
                          <Typography variant="subtitle3">
                            {branch.name}
                          </Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {summary.map((item) => (
                      <TableRow key={item.name}>
                        <TableCell component="th" scope="row">
                          <Typography variant="subtitle3">
                            {item.productName}
                          </Typography>
                        </TableCell>
                        {branchList.map((branch) => (
                          <TableCell>
                            <Typography variant="subtitle3">
                              {Object.keys(item.branchValues).includes(
                                branch.id
                              )
                                ? item.branchValues[branch.id]
                                : "-"}
                            </Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : null}
            </TableContainer>
          )}
        </Container>
      )}
    </>
  );
};

export default Summary;
