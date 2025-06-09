import React, { useState, useEffect, useContext } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import api from "../../services/api";
import SimpleList from "../SimpleList/SimpleList";
import TextField from "@material-ui/core/TextField";
import { CircularProgress } from "@material-ui/core";

import UserContext from "../../Context/User/context";

export default function Category({ handleCategory }) {
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState({ name: "" });
  const { state } = useContext(UserContext);
  const [content, setContent] = useState("list");
  const [loading, setLoading] = useState(false);

  const pathApi = `categories`;
  useEffect(() => {
    setLoading(true);
    api
      .get("categories")
      .then(({ data }) => setCategoryList(data))
      .finally(() => setLoading(false));
    return () => {};
  }, [state.currentBranche]);

  const apiGet = () => {
    setLoading(true);
    api
      .get(pathApi)
      .then(({ data }) => {
        setCategoryList(data);
        handleCategory(data);
      })
      .finally(() => setLoading(false));
    handleChangeContent("list");
  };
  const handleChangeContent = (value) => {
    if (value === "list") {
      setCategory({ name: "" });
    }
    setContent(value);
  };

  const handleChangeCategorySelected = (value) => {
    setCategory(categoryList.find((e) => e.id === value));
  };

  const handleChangeContentEdit = (value) => {
    handleChangeCategorySelected(value);
    handleChangeContent("edit");
  };
  const handleChangeContentDelete = (value) => {
    handleChangeCategorySelected(value);
    handleChangeContent("delete");
  };
  const apiCreate = () => {
    const { name } = category;
    if (!name || !name.length) return null;

    setLoading(true);
    api
      .post(pathApi, { name })
      .then((res) => apiGet())
      .catch(() => handleChangeContent("list"))
      .finally(() => setLoading(false));
  };

  const apiEdit = () => {
    const { name } = category;
    if (!name || !name.length) return null;

    setLoading(true);
    api
      .put(`${pathApi}/${category.id}`, { name: category.name })
      .then((res) => apiGet())
      .catch(() => handleChangeContent("list"))
      .finally(() => setLoading(false));
  };

  const apiDelete = () => {
    setLoading(true);
    api
      .delete(`${pathApi}/${category.id}`)
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
              list={categoryList}
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
            <TextField
              value={category.name}
              onChange={(e) =>
                setCategory((prevState) => ({
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
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
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
          </div>
        );
        break;
      case "edit":
        component = (
          <div
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            <TextField
              value={category.name}
              onChange={(e) =>
                setCategory((prevState) => ({
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
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
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
          </div>
        );
        break;
      case "delete":
        component = (
          <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
            <Typography variant="h6" style={{ marginRight: "8px" }}>
              Tem certeza que deseja deletar a categoria{" "}
              <b style={{ color: "#ff844c" }}>{category.name}</b> ?
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
              Categorias
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
            {getContentComponent(content)}
          </>
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              paddingTop: "24px",
              marginTop: "24px",
            }}
          >
            <CircularProgress />
          </div>
        )}
      </div>
    </div>
  );
}
