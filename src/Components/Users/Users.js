import React, { useState, useEffect, useContext } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import api from "../../services/api";
import SimpleTable from "../SimpleTable/SimpleTable";
import TextField from "@material-ui/core/TextField";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

import UserContext from "../../Context/User/context";
import UsersForm from "../UsersForm/UsersForm";
import { Add, AddBox } from "@material-ui/icons";
import { CircularProgress } from "@material-ui/core";

function getPathApi(id) {
  return `/users`;
}

export default function Users() {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    name: "",
    branchs: [],
  });
  const { state } = useContext(UserContext);
  const [content, setContent] = useState("list");

  // console.log("@@@ state.currentBranche", state.currentBranche);
  const pathApi = getPathApi(state.currentBranche.CompanyBranchId);

  useEffect(() => {
    setLoading(true);
    api
      .get("/users")
      .then(({ data }) => setUsersList(data))
      .finally(() => setLoading(false));
    return () => {};
  }, []);

  const apiGet = () => {
    setLoading(true);
    api
      .get(pathApi)
      .then(({ data }) => {
        setUsersList(data);
      })
      .finally(() => setLoading(false));
    handleChangeContent("list");
  };
  const handleChangeContent = (value) => {
    if (value === "list") {
      setUser({
        name: "",
        branchs: [],
      });
    }
    setContent(value);
  };

  const handleChangeUserSelected = (value) => {
    setLoading(true);
    api
      .get(`users/${value}`)
      .then(({ data }) => {
        setUser(data);
      })
      .finally(() => setLoading(false));
  };

  const handleChangeContentEdit = (value) => {
    handleChangeUserSelected(value);
    handleChangeContent("edit");
  };
  const handleChangeContentDelete = (value) => {
    handleChangeUserSelected(value);
    handleChangeContent("delete");
  };

  const prodValidation = (value) => {
    const { name, categoryId, companyBranchId, minQuantity, quantity } = value;

    return true;
  };

  const apiCreate = (value) => {
    const dataIsValid = prodValidation(value);
    setLoading(true);
    api
      .post(pathApi, {
        ...value,
        companyBranchId: value.categoryId,
        minQuantity: parseInt(value.minQuantity),
      })
      .then((res) => apiGet())
      .catch(() => handleChangeContent("list"))
      .finally(() => setLoading(false));
  };

  const apiCreateAdmin = (value) => {
    const dataIsValid = prodValidation(value);
    setLoading(true);
    api
      .post("users/central-stock-admin", {
        name: value,
      })
      .then((res) => apiGet())
      .catch(() => handleChangeContent("list"))
      .finally(() => setLoading(false));
  };

  const apiEdit = (value) => {
    const dataIsValid = prodValidation(value);
    setLoading(true);
    api
      .put(`users/${value.id}`, {
        name: value.name,
        branchs: value.branchs,
      })
      .then((res) => apiGet())
      .finally(() => setLoading(false));
  };

  const apiDelete = () => {
    setLoading(true);
    api
      .delete(`users/${user.id}`)
      .then((res) => apiGet())
      .finally(() => setLoading(false));
  };

  const getContentComponent = (value) => {
    let component;
    switch (value) {
      case "list":
        component = (
          <div style={{ marginBottom: "8px" }}>
            <SimpleTable
              list={usersList.map((e) => ({
                ...e,
                replenisher: e.isCentralStockAdmin ? (
                  <CheckIcon style={{ color: "green" }} color={"primary"} />
                ) : (
                  <CloseIcon style={{ color: "red" }} />
                ),
              }))}
              handleChangeContentEdit={handleChangeContentEdit}
              handleChangeContentDelete={handleChangeContentDelete}
              colunmList={[
                { name: "Usuarios", key: "name" },
                { name: "AcessCode", key: "accessCode" },
                { name: "Repositor", key: "replenisher" },
              ]}
              visibleIcon={false}
            />
          </div>
        );
        break;
      case "create":
        component = (
          <div
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            <UsersForm
              user={null}
              handleOnClickActionSubmit={(value) => apiCreate(value)}
              handleOnClickActionCancel={() => handleChangeContent("list")}
              title="Criar Usuario"
              actionSubmitText="Criar"
            />
          </div>
        );
        break;
      case "create_admin":
        component = (
          <div
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            <UsersForm
              user={null}
              isAdmin
              handleOnClickActionSubmit={(value) => apiCreateAdmin(value)}
              handleOnClickActionCancel={() => handleChangeContent("list")}
              title="Criar Usuario Repositor"
              actionSubmitText="Criar"
            />
          </div>
        );
        break;
      case "edit":
        component = (
          <div
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            <UsersForm
              user={user}
              handleOnClickActionSubmit={(value) => apiEdit(value)}
              handleOnClickActionCancel={() => handleChangeContent("list")}
              title="Editar Usuario"
              actionSubmitText="Editar"
            />
          </div>
        );
        break;
      case "delete":
        component = (
          <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
            <Typography variant="h6" style={{ marginRight: "8px" }}>
              Tem certeza que deseja deletar o usuario{" "}
              <b style={{ color: "#ff844c" }}>{user.name}</b> ?
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
      {!loading ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            // padding: "24px",
            margin: "24px",
            overflow: "hidden",
          }}
        >
          {!["create", "edit"].includes(content) && (
            <>
              {content === "list" ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: usersList.length ? "flex-end" : "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    href="#contained-buttons"
                    size="medium"
                    onClick={() => handleChangeContent("create_admin")}
                    startIcon={<AddBox />}
                    style={{ width: usersList.length ? "fit-content" : "45%" }}
                  >
                    Criar Usuario Repositor
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    href="#contained-buttons"
                    size="medium"
                    onClick={() => handleChangeContent("create")}
                    startIcon={<AddBox />}
                    style={{ width: usersList.length ? "fit-content" : "45%" }}
                  >
                    Criar usuario
                  </Button>
                </div>
              ) : null}
              {!usersList.length && (
                <Typography
                  variant="subtitle1"
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50px",
                    marginBottom: "8px",
                    color: "#ff844c",
                  }}
                >
                  Adicione o primeiro usuário
                </Typography>
              )}
              {/* {content !== "list" && "Usuarios"} */}
            </>
          )}
          {getContentComponent(content)}
        </div>
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
