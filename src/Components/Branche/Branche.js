import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import api from "../../services/api";
import SimpleList from "../SimpleList/SimpleList";
import TextField from "@material-ui/core/TextField";
import { CircularProgress, Container } from "@material-ui/core";

export default function Branches({ handleBrancheList }) {
  const [brancheList, setBrancheList] = useState([]);
  const [branche, setBranche] = useState({ name: "" });
  const [name, setName] = useState("");
  const [content, setContent] = useState("list");
  const [loading, setLoading] = useState(false);
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/branchs")
      .then(({ data }) => setBrancheList(data))
      .finally(() => setLoading(false));
    return () => {};
  }, []);


  const apiGet = () => {
    setLoading(true);
    api
      .get("/branchs")
      .then(({ data }) => {
        setBrancheList(data);
        handleBrancheList(
          data.map((e) => ({
            CompanyBranchId: e.id,
            CompanyBranchName: e.name,
          }))
        );
      })
      .catch(() => handleChangeContent("list"))
      .finally(() => setLoading(false));
    handleChangeContent("list");
  };
  const handleChangeContent = (value) => {
    if (value === "list") {
      setBranche({ name: "" });
    }
    setContent(value);
  };

  const handleChangeBrancheSelected = (value) => {
    setLoading(true);
    api
      .get(`branchs/${value}`)
      .then(({ data }) => {
        setBranche(data);
        setStartHour(data.startHour);
        setEndHour(data.endHour);
      })
      .catch((err) => console.error(err))
      .finally((err) => setLoading(false));
  };

  const handleChangeContentEdit = (value) => {
    handleChangeBrancheSelected(value);
    handleChangeContent("edit");
  };
  const handleChangeContentDelete = (value) => {
    handleChangeBrancheSelected(value);
    handleChangeContent("delete");
  };
  const apiCreate = () => {
    const { name } = branche;
    if (!name || !name.length) return null;
    setLoading(true);
    api
      .post("/branchs", { name, startHour, endHour })
      .then((res) => apiGet())
      .catch(() => handleChangeContent("list"))
      .finally(() => setLoading(false));
  };

  const apiEdit = () => {
    const { name } = branche;
    if (!name || !name.length) return null;
    setLoading(true);
    api
      .put(`/branchs/${branche.id}`, {
        name: branche.name,
        startHour: startHour.length === 5 ? startHour + ":00" : startHour,
        endHour: endHour.length === 5 ? endHour + ":00" : endHour,
      })
      .then((res) => apiGet())
      .catch(() => handleChangeContent("list"))
      .finally(() => setLoading(false));
  };

  const apiDelete = () => {
    const { name } = branche;
    if (!name || !name.length) return null;
    setLoading(true);
    api
      .delete(`/branchs/${branche.id}`)
      .then((res) => apiGet())
      .catch(() => handleChangeContent("list"))
      .finally(() => setLoading(false));
  };

  const getContentComponent = (value) => {
    let component;
    switch (value) {
      case "list":
        component = (
          <div style={{ marginBottom: "8px" }}>
            <SimpleList
              list={brancheList}
              handleChangeContentEdit={handleChangeContentEdit}
              handleChangeContentDelete={handleChangeContentDelete}
            />
          </div>
        );
        break;
      case "create":
        component = (
          <div
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            <Container component="main" maxWidth="sm">
              <Typography
                variant="h5"
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50px",
                }}
              >
                Filial
              </Typography>

              <TextField
                value={branche.name}
                onChange={(e) =>
                  setBranche((prevState) => ({
                    ...prevState,
                    name: e.target.value,
                  }))
                }
                id="standard-full-width"
                label="Nome"
                // style={{ margin: 8 }}
                placeholder="Nome"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "8px",
                }}
              >
                <TextField
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  fullWidth
                  id="startHour"
                  label="Horário inicial"
                  type="time"
                  // className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                  style={{ marginRight: "8px" }}
                />

                <TextField
                  value={endHour}
                  onChange={(e) => setEndHour(e.target.value)}
                  fullWidth
                  id="time"
                  label="Horário Final"
                  type="time"
                  // className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                  style={{ marginLeft: "8px" }}
                />
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  marginTop: "8px",
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  href="#contained-buttons"
                  size="medium"
                  onClick={() => handleChangeContent("list")}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  href="#contained-buttons"
                  size="medium"
                  onClick={() => apiCreate()}
                >
                  Criar
                </Button>
              </div>
            </Container>
          </div>
        );
        break;
      case "edit":
        component = (
          <div
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            <Container component="main" maxWidth="sm">
              <Typography
                variant="h5"
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50px",
                }}
              >
                Filial
              </Typography>

              <TextField
                value={branche.name}
                onChange={(e) =>
                  setBranche((prevState) => ({
                    ...prevState,
                    name: e.target.value,
                  }))
                }
                id="standard-full-width"
                label="Nome"
                // style={{ margin: 8 }}
                placeholder="Nome"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "8px",
                }}
              >
                <TextField
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  fullWidth
                  id="startHour"
                  label="Horário inicial"
                  type="time"
                  // className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                  style={{ marginRight: "8px" }}
                />

                <TextField
                  value={endHour}
                  onChange={(e) => setEndHour(e.target.value)}
                  fullWidth
                  id="time"
                  label="Alarm clock"
                  type="time"
                  // className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 min
                  }}
                  style={{ marginLeft: "8px" }}
                />
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  marginTop: "8px",
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  href="#contained-buttons"
                  size="medium"
                  onClick={() => handleChangeContent("list")}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  href="#contained-buttons"
                  size="medium"
                  onClick={() => apiEdit()}
                >
                  Editar
                </Button>
              </div>
            </Container>
          </div>
        );
        break;
      case "delete":
        component = (
          <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
            <Typography variant="h6" style={{ marginRight: "8px" }}>
              Tem certeza que deseja deletar a filial{" "}
              <b style={{ color: "#ff844c" }}>{branche.name}</b> ?
            </Typography>

            <div>
              <Button
                variant="contained"
                color="secondary"
                href="#contained-buttons"
                size="medium"
                onClick={() => handleChangeContent("list")}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                href="#contained-buttons"
                size="medium"
                onClick={() => apiDelete()}
              >
                Confirmar
              </Button>
            </div>
          </div>
        );
        break;
      // default:
      //   console.log("nada");
    }
    return component;
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          margin: "24px",
        }}
      >
        {!loading ? (
          <>
            <Typography
              variant="h5"
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                height: "50px",
              }}
            >
              {content === "list" && "Filiais"}
              {content === "list" ? (
                <Button
                  variant="contained"
                  color="primary"
                  href="#contained-buttons"
                  size="medium"
                  onClick={() => handleChangeContent("create")}
                >
                  Criar
                </Button>
              ) : null}
            </Typography>
            {getContentComponent(content)}{" "}
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
}
