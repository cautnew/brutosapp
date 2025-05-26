export const formatUserData = (data) => {
  // console.log("@@@ formatUserData @param data", data);
  return {
    isAdmin: data.IsAdmin === "True" ? true : false,
    IsCentralStockAdmin: data.IsCentralStockAdmin === "True" ? true : false,
    userId: data.UserId,
    userName: data.UserName,
    branches: JSON.parse(data.Branchs),
    currentBranche: JSON.parse(data.Branchs)[0],
    exp: data.exp,
    iat: data.iat,
    nbf: data.nbf,
  };
};
