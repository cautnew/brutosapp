import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import api from "../../services/api";
import SimpleList from "../SimpleList/SimpleList";
import TextField from "@material-ui/core/TextField";
import { CircularProgress, Container } from "@material-ui/core";

export default function Checklist({ handleBrancheList }) {
  const [checklistList, setChecklistList] = useState([]);
  const [label, setLabel] = useState("");
  const [checklistId, setChecklistId] = useState("");
  const [content, setContent] = useState("list");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get("/branchs/checklist")
      .then(({ data }) => setChecklistList(data))
      .finally(() => setLoading(false));
    return () => {};
  }, []);

  const apiGet = () => {
    setLoading(true);
    api
      .get("/branchs/checklist")
      .then(({ data }) => {
        setChecklistList(data);
      })
      .catch(() => handleChangeContent("list"))
      .finally(() => setLoading(false));
    handleChangeContent("list");
  };
  const handleChangeContent = (value) => {
    if (value === "list") {
      setLabel("");
      setChecklistId("");
    }
    setContent(value);
  };

  const handleChangeContentDelete = (value) => {
    setChecklistId(value);
    handleChangeContent("delete");
  };
  const apiCreate = () => {
    setLoading(true);
    api
      .post("/branchs/checklist", { name: label })
      .then((res) => apiGet())
      .catch(() => handleChangeContent("list"))
      .finally(() => setLoading(false));
  };

  const apiDelete = () => {
    setLoading(true);
    api
      .delete(`/branchs/checklist/${checklistId}`)
      .then((res) => apiGet())
      .catch(() => handleChangeContent("list"))
      .finally(() => setLoading(false));
  };

  const getContentComponent = (value) => {
    let component;
    switch (value) {
      case "list":
        component = (
          <Container component="main" maxWidth="lg" >
            <SimpleList
              list={checklistList}
              handleChangeContentDelete={handleChangeContentDelete}
            />
          </Container>
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
                Checklist
              </Typography>

              <TextField
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                id="standard-full-width"
                label="Texto"
                // style={{ margin: 8 }}
                placeholder="Texto"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />

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
      case "delete":
        component = (
          <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
            <Typography variant="h6" style={{ marginRight: "8px" }}>
              Tem certeza que deseja deletar a checklist
              <b style={{ color: "#ff844c" }}>{label}</b> ?
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
      default:
        console.warn("No content to show");
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
          // padding: "24px",
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
                justifyContent: "flex-end",
                alignItems: "center",
                height: "50px",
                paddingRight: '8px'
              }}
            >
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
