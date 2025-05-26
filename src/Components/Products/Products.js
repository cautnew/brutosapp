import React, { useState, useEffect, useContext } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import api from "../../services/api";
import SimpleTable from "../SimpleTable/SimpleTable";
import TextField from "@material-ui/core/TextField";

import UserContext from "../../Context/User/context";
import ProductForm from "../ProductForm/ProductForm";
import { AddBox } from "@material-ui/icons";
import { CircularProgress } from "@material-ui/core";

export default function Products() {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    categoryId: 0,
    quantity: 0,
    minQuantity: 0,
  });
  const { state } = useContext(UserContext);
  const [content, setContent] = useState("list");

  const pathApi = "products";

  useEffect(() => {
    setLoading(true);
    api
      .get(pathApi)
      .then(({ data }) => setProductsList(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
    return () => {};
  }, []);

  const apiGet = () => {
    setLoading(true);
    api
      .get(pathApi)
      .then(({ data }) => {
        setProductsList(data);
      })
      .finally(() => setLoading(false));
    handleChangeContent("list");
  };

  const handleChangeContent = (value) => {
    if (value === "list") {
      setProduct({
        name: "",
        categoryId: 0,
        quantity: 0,
        minQuantity: 0,
      });
    }
    setContent(value);
  };

  const handleChangeProductSelected = (value) => {
    setLoading(true);
    api
      .get(`products/${value}`)
      .then(({ data }) => {
        setProduct(data);
      })
      .finally(() => setLoading(false));
  };

  const handleChangeContentEdit = (value) => {
    handleChangeProductSelected(value);
    handleChangeContent("edit");
  };
  const handleChangeContentDelete = (value) => {
    handleChangeProductSelected(value);
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
      })
      .then((res) => apiGet())
      .catch(() => handleChangeContent("list"))
      .finally(() => setLoading(false));
  };

  const apiEdit = (value) => {
    const dataIsValid = prodValidation(value);
    setLoading(true);
    api
      .put(`products/${value.id}`, {
        ...value,
      })
      .then((res) => apiGet())
      .finally(() => setLoading(false));
  };

  const apiDelete = () => {
    setLoading(true);
    api
      .delete(`products/${product.id}`)
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
              list={productsList}
              handleChangeContentEdit={handleChangeContentEdit}
              handleChangeContentDelete={handleChangeContentDelete}
              colunmList={[
                { name: "Produtos", key: "name" },
              ]}
              visibleIcon
            />
          </div>
        );
        break;
      case "create":
        component = (
          <div
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            <ProductForm
              product={null}
              handleOnClickActionSubmit={(value) => apiCreate(value)}
              handleOnClickActionCancel={() => handleChangeContent("list")}
              title="Produto"
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
            <ProductForm
              product={product}
              handleOnClickActionSubmit={(value) => apiEdit(value)}
              handleOnClickActionCancel={() => handleChangeContent("list")}
              title="Produto"
              actionSubmitText="Editar"
            />
          </div>
        );
        break;
      case "delete":
        component = (
          <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
            <Typography variant="h6" style={{ marginRight: "8px" }}>
              Tem certeza que deseja deletar o produto{" "}
              <b style={{ color: "#ff844c" }}>{product.name}</b> ?
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
            padding: "24px",
            margin: "24px",
          }}
        >
          {!["create", "edit"].includes(content) && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: productsList.length ? "flex-end" : "center",
                }}
              >
                {content === "list" ? (
                  <Button
                    variant="contained"
                    color="primary"
                    href="#contained-buttons"
                    size="medium"
                    startIcon={<AddBox />}
                    onClick={() => handleChangeContent("create")}
                    style={{
                      width: productsList.length ? "fit-content" : "100%",
                    }}
                  >
                    Criar PRODUTO
                  </Button>
                ) : null}
              </div>
              {!productsList.length && (
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
                  Adicione o primeiro produto
                </Typography>
              )}
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
