import axios from "axios";

const TOKEN_KEY = "@StockControlSystem-TokenPDV";
const ACCESS_TOKEN_KEY = "@StockControlSystem-AccessTokenPDV";
const ACCESS_TOKEN_EXPIRATION_KEY = "@StockControlSystem-AccessTokenExpPDV";
const ACCESS_TOKEN_EXPIRATION_DATE_KEY = "@StockControlSystem-AccessTokenExpDatePDV";

const api_url = "https://api.tabletcloud.com.br";
const username = "diretoria@ntc-rs.com.br";
const password = "ummt-3587-6499-7009@7447358";
const client_id = "7140";
const client_secret = "WBLW-1670-8610-6660";

const loadAccessToken = async () => {
  const originalTokenResponse = await fetch(`${api_url}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `username=${username}&password=${password}&client_id=${client_id}&client_secret=${client_secret}&grant_type=password`
  });
  const originalTokenResponseJson = await originalTokenResponse.json();
  console.log("originalTokenResponseJson", originalTokenResponseJson);

  // const request = await api.post('/token', {
  //   username, password, client_id, client_secret, grant_type: 'password'
  // }, {
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   }
  // });
  // const tokenJson = await request.data;

  // console.log("request", request);
  // console.log("tokenJson", tokenJson);

  saveAccessToken(originalTokenResponseJson);
};

const getToken = () => sessionStorage.getItem(TOKEN_KEY);
const getAccessToken = async () => {
  const token = sessionStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    return token;
  }

  loadAccessToken();
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
};
/**
 * @returns {
 *  Authorization: string,
 *  Content-Type: string
 * }
 */
const getAuthorizationHeader = async () => {
  const myHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  return myHeaders;
}

const api = axios.create({
  baseURL: api_url,
  headers: getAuthorizationHeader(),
});

api.interceptors.request.use(async (config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const isAuthenticated = () => getToken() !== null;

const login = (token) => {
  sessionStorage.setItem(TOKEN_KEY, token);
};
const logout = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
};

/**
 * @param {
 *  access_token: string,
 *  token_type: string,
 *  expires_in: number,
 * } accessTokenJson 
 */
const saveAccessToken = (accessTokenJson) => {
  console.log('accessTokenJson', accessTokenJson);
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessTokenJson.access_token);

  const expirationDate = new Date();
  expirationDate.setSeconds(expirationDate.getSeconds() + accessTokenJson.expires_in);

  sessionStorage.setItem(ACCESS_TOKEN_EXPIRATION_KEY, accessTokenJson.expires_in);
  sessionStorage.setItem(ACCESS_TOKEN_EXPIRATION_DATE_KEY, expirationDate.toISOString());
};

const getProducts = async () => {
  // try {
  //   const productsResponse = await fetch(`${api_url}/produtos/get`, {
  //     method: "GET",
  //     headers: getAuthorizationHeader()
  //   });
  //   const productsList = await productsResponse.json();
  //   console.log("productsList", productsList);
  // } catch (e) {
  //   console.error("Error loading products:", e);
  //   loadAccessToken();
  //   return getProducts();
  // }
  const products = await api.get('/produtos/get', {
    headers: getAuthorizationHeader()
  });
  console.log("products", products);
  const productsList = await products.data;
  console.log("productsList", productsList);
};

const getFilials = async () => {
  // const filialsResponse = await fetch(`${api_url}/filial/get`, {
  //   method: "GET",
  //   headers: getAuthorizationHeader()
  // });
  // const filialsList = await filialsResponse.json();

  // console.log("filialsList", filialsList);
  const filials = await api.get('/filial/get', {
    headers: getAuthorizationHeader()
  });
  console.log("filials", filials);
  const filialsList = await filials.data;
  console.log("filialsList", filialsList);
};

export function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

const authObj = {
  getToken,
  getAccessToken,
  isAuthenticated,
  login,
  logout,
  getProducts,
  getFilials,
  parseJwt
};

export default authObj;
