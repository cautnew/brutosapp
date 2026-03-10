import axios from "axios";

const TOKEN_KEY = "@StockControlSystem-TokenPDV";
const ACCESS_TOKEN_KEY = "@StockControlSystem-AccessTokenPDV";
const ACCESS_TOKEN_EXPIRATION_KEY = "@StockControlSystem-AccessTokenExpPDV";
const ACCESS_TOKEN_EXPIRATION_DATE_KEY = "@StockControlSystem-AccessTokenExpDatePDV";

const api_url = "https://api.tabletcloud.com.br";
const username = "ZGlyZXRvcmlhQG50Yy1ycy5jb20uYnI=";
const password = "dW1tdC0zNTg3LTY0OTktNzAwOUA3NDQ3MzU4";
const client_id = "NzE0MA==";
const client_secret = "V0JMVy0xNjcwLTg2MTAtNjY2MA==";

const loadAccessToken = async () => {
  const originalTokenResponse = await fetch(`${api_url}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `username=${username}&password=${password}&client_id=${client_id}&client_secret=${client_secret}&grant_type=password`
  });
  const originalTokenResponseJson = await originalTokenResponse.json();
  console.log("loadAccessToken | data", originalTokenResponseJson);

  saveAccessToken(originalTokenResponseJson);
};

const getToken = () => sessionStorage.getItem(TOKEN_KEY);
const getAccessToken = async () => {
  const token = sessionStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    return token;
  }

  await loadAccessToken();
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
    'Authorization': `Bearer ${await getAccessToken()}`
  };

  console.log("getAuthorizationHeader | header", myHeaders);

  return myHeaders;
}

const api = axios.create({
  baseURL: api_url,
  headers: getAuthorizationHeader(),
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
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
  const products = await api.get('/produtos/get');
  const productsList = await products.data;
  console.log("produtosList", productsList);
};

const getFilials = async () => {
  const filials = await api.get('/filial/get');
  const filialsList = await filials.data;
  console.log("filialsList", filialsList);
};

const getEstoque = async (filial) => {
  const filials = await api.get('/estoque/get/' + filial);
  const filialsList = await filials.data;
  console.log("estoqueList", filialsList);
};

getAccessToken();

const authObj = {
  getToken,
  getAccessToken,
  isAuthenticated,
  login,
  logout,
  getProducts,
  getFilials,
  getEstoque,
};

export default authObj;
