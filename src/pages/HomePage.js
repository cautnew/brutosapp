import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PeopleIcon from "@material-ui/icons/People";
import CategoryIcon from "@material-ui/icons/Category";
import BusinessIcon from "@material-ui/icons/Business";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import LinearProgress from "@material-ui/core/LinearProgress";
import ShopIcon from "@material-ui/icons/Shop";
import ShopTwoIcon from "@material-ui/icons/ShopTwo";
import PostAddIcon from "@material-ui/icons/PostAdd";
import Assessment from "@material-ui/icons/Assessment";
import CheckBox from "@material-ui/icons/CheckBox";
import Input from "@material-ui/icons/Input";
import FindInPageOutlined from "@material-ui/icons/FindInPageOutlined";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import UserContext from "../Context/User/context";
import { ErrorContext } from "../Context/Error/context";
import Branches from "../Components/Branche/Branche";
import Category from "../Components/Category/Category";
import Products from "../Components/Products/Products";
import Users from "../Components/Users/Users";
import CentralStock from "../Components/CentralStock/CentralStock";
import Stock from "../Components/Stock/Stock";
import Grades from "../Components/Grades/Grades";
import ProductsByBranch from "../Components/Reports/ProductsByBranch";
import BasicModal from "../Components/Modal/Modal";
import Checklist from "../Components/Branche/Checklist";
import Summary from "../Components/Summary";

import "./HomePage.css";

import { getToken, parseJwt, logout } from "../services/auth";
import { formatUserData } from "../services/format";
import { Button, IconButton, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import ProductEntry from "../Components/ProductEntry";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
    height: "100vh",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    // overflowX: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    margin: "0px",
  },
  fixedHeight: {
    height: 240,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: "200px",
  },
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
}));

const useStylesHeader = makeStyles((theme) => ({
  root: {
    margin: "0px",
    height: "85px",
    padding: "0px",
    paddingTop: "10px",
  },
  menuButton: {
    // marginRight: theme.spacing(2),
  },
  title: {
    // flexGrow: 1,
    color: "rgba(0, 0, 0, 0.67)",
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    display: "flex",
    alignItems: "center",
    fontWeight: "400",
    lineHeight: "1.5",
    letterSpacing: "0.00938em",
  },
}));

function AppBarBranche({
  branche,
  brancheList,
  setBranche,
  buttonMenu,
  buttonMenuAction,
  showLogoutButton,
}) {
  const classes = useStylesHeader();
  const [openModal, setOpenModal] = React.useState(false);

  const handleChangeBranche = (e) => {
    setBranche(brancheList.find((b) => b.CompanyBranchId === e.target.value));
  };
  return (
    <AppBar
      className={classes.root}
      position="static"
      style={{
        backgroundColor: "#fff",
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        boxShadow: "none",
      }}
    >
      <Container
        maxWidth="lg"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Typography
            variant="h5"
            color="secondary"
            style={{ color: "rgba(0, 0, 0, 0.87)" }}
          >
            Controle de Estoque
          </Typography>
        </Toolbar>

        {showLogoutButton && (
          <Button
            // style={{ width: "100%" }}
            variant="outlined"
            onClick={() => {
              setOpenModal(true);
            }}
            color="primary"
          >
            Sair
          </Button>
        )}

        {buttonMenu && (
          <IconButton size="medium" onClick={buttonMenuAction}>
            <MenuOpenIcon
              style={{ width: "40px", height: "40px" }}
            ></MenuOpenIcon>
          </IconButton>
        )}
      </Container>
      <BasicModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        handleOnClickAction={() => {
          logout();
          window.location = "/login";
        }}
      />
    </AppBar>
  );
}

const MODULES = [
  { value: "central_stock", name: "Estoque Central", icon: <ShopTwoIcon /> },
  { value: "stock", name: "Estoque", icon: <ShopIcon /> },
  { value: "branches", name: "Filiais", icon: <BusinessIcon /> },
  { value: "products", name: "Produtos", icon: <ShoppingCartIcon /> },
  { value: "users", name: "Usuarios", icon: <PeopleIcon /> },
  { value: "category", name: "Categorias", icon: <CategoryIcon /> },
  { value: "invoices", name: "Notas", icon: <PostAddIcon /> },
  { value: "reports", name: "Relatórios", icon: <Assessment /> },
  { value: "checklist", name: "Checklist", icon: <CheckBox /> },
  { value: "product_entry", name: "Entrada de produtos", icon: <Input /> },
  { value: "summary", name: "Resumo", icon: <FindInPageOutlined /> },
];
const MENU_LIST = MODULES.map((e) => e.value);

const getUserModuleList = (userConfig) => {
  let modules = MODULES;
  if (userConfig.isAdmin) {
    return modules;
  } else if (userConfig.IsCentralStockAdmin) {
    return modules.filter((mod) =>
      [
        "stock",
        "invoices",
        "central_stock",
        "product_entry",
        "summary",
      ].includes(mod.value)
    );
  } else {
    const permissions = [].concat(
      ...userConfig.branches.map((branch) =>
        branch.Permissions ? branch.Permissions : []
      )
    );
    const allowedModules = [];
    if (
      permissions.includes("UpdateFinalQuantity") ||
      permissions.includes("UpdatePdvQuantity")
    )
      allowedModules.push("stock");
    if (permissions.includes("ReadNotes")) allowedModules.push("invoices");
    if (permissions.includes("ReadReports")) allowedModules.push("reports");

    return modules.filter((mod) => allowedModules.includes(mod.value));
  }
};

export default function HomePage() {
  const classes = useStyles();
  const matches = useMediaQuery("(min-width:600px)");

  const [open, setOpen] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [openDrawerMobile, setOpenDrawerMobile] = React.useState(true);
  const [userConfig, setUserConfig] = React.useState(false);
  const [moduleList, setModuleList] = React.useState([]);
  const { state, onClose } =
    React.useContext(ErrorContext);
  const {
    handleChangeState,
    handleChangeBranches: handleChangeBranchesContext,
  } = React.useContext(UserContext);
  const [menu, setMenu] = React.useState(MENU_LIST[4]);

  React.useEffect(() => {
    handleChangeUserConfig(formatUserData(parseJwt(getToken())));
  }, []);

  const handleChangeBranche = (value) => {
    setUserConfig((prevState) => ({ ...prevState, currentBranche: value }));
    handleChangeState({ ...userConfig, currentBranche: value });
  };

  const handleChangeBranches = (value) => {
    setUserConfig((prevState) => ({ ...prevState, branches: value }));
    handleChangeBranchesContext(value);
  };

  const handleChangeCategory = (value) => {
    // console.log("@@@ category", value);
    // setCategory(value);
    // handleChangeBranchesContext(value);
  };

  const handleChangeUserConfig = (value) => {
    const userModuleList = getUserModuleList(value);
    setMenu(userModuleList[0].value);
    setModuleList(userModuleList);
    setUserConfig(value);
    setLoading(false);
    handleChangeState(value);
  };

  const list = (anchor, items) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={() => setOpenDrawerMobile(false)}
      onKeyDown={() => setOpenDrawerMobile(false)}
    >
      <List>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <div>
            {items.length > 1
              ? items.map((module) => (
                  <>
                    <ListItem
                      button
                      selected={menu === module.value}
                      onClick={() => setMenu(module.value)}
                    >
                      <ListItemIcon>{module.icon}</ListItemIcon>
                      <ListItemText primary={module.name} />
                    </ListItem>
                  </>
                ))
              : null}
          </div>
          <Button
            style={{ width: "100%" }}
            variant="outlined"
            onClick={() => {
              logout();
              window.location = "/login";
            }}
            color="primary"
          >
            Sair
          </Button>
        </div>
      </List>
    </div>
  );

  const getContentComponent = (selected) => {
    const module = selected;
    switch (module) {
      case "central_stock":
        return <CentralStock />;
      case "stock":
        return (
          <Stock
            isAdmin={userConfig.isAdmin}
            IsCentralStockAdmin={userConfig.IsCentralStockAdmin}
            branchs={userConfig.branches}
          />
        );
      case "branches":
        return <Branches handleBrancheList={handleChangeBranches} />;
      case "category":
        return <Category handleCategory={handleChangeCategory} />;
      case "products":
        return <Products />;
      case "users":
        return <Users />;
      case "invoices":
        return (
          <Grades
            isAdmin={userConfig.isAdmin}
            isCentralStockAdmin={userConfig.IsCentralStockAdmin}
          />
        );
      case "reports":
        return (
          <ProductsByBranch
            branchs={userConfig.branches}
            isAdmin={userConfig.isAdmin}
          />
        );
      case "checklist":
        return <Checklist />;
      case "product_entry":
        return (
          <ProductEntry
            branchs={userConfig.branches}
            isAdmin={userConfig.isAdmin}
            isCentralStockAdmin={userConfig.IsCentralStockAdmin}
          />
        );
      case "summary":
        return (
          <Summary
            branchs={userConfig.branches}
            isAdmin={userConfig.isAdmin}
            isCentralStockAdmin={userConfig.IsCentralStockAdmin}
          />
        );
      default:
        console.warn("No content to show");
        return null;
    }
  };

  return (
    <div className={classes.root}>
      {moduleList.length > 1 ? (
        <>
          {matches ? (
            <Drawer
              variant="permanent"
              classes={{
                paper: clsx(
                  classes.drawerPaper,
                  !open && classes.drawerPaperClose,
                  classes.paper
                ),

              }}
              style={{ backgroundColor: "red" }}
              open={matches}
            >
              <div className={ classes.toolbarIcon }>
                <img src="/logo-brutos.jpg" alt="Logo" style={{ width: "40px", height: "40px", marginRight: "10px", borderRadius: '5px' }} /><h2>Brutos</h2>
              </div>
              <Divider />
              <List style={{ marginTop: "32px", height: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                  }}
                >
                  <div>
                    {moduleList.map((module) => (
                      <ListItem
                        button
                        selected={menu === module.value}
                        onClick={() => setMenu(module.value)}
                      >
                        <ListItemIcon>{module.icon}</ListItemIcon>
                        <ListItemText primary={module.name} />
                      </ListItem>
                    ))}
                  </div>

                  <Button
                    style={{ width: "100%" }}
                    variant="outlined"
                    onClick={() => {
                      logout();
                      window.location = "/login";
                    }}
                    color="primary"
                  >
                    Sair
                  </Button>
                </div>
              </List>
            </Drawer>
          ) : null}

          {!matches && openDrawerMobile ? (
            <Drawer
              open={openDrawerMobile}
              onClose={() => setOpenDrawerMobile(false)}
            >
              {list("right", moduleList)}
            </Drawer>
          ) : null}
        </>
      ) : null}

      <div
        style={{
          display: "flex",
          aignItems: "space-beetwen",
          width:
            !matches || (!userConfig.isAdmin && !userConfig.IsCentralStockAdmin)
              ? "100%"
              : "calc(100% - 240px)",
          height: "100vh",
          boxSizing: "border-box",
          flexDirection: "column",
          backgroundColor: "#fff",
        }}
      >
        <AppBarBranche
          branche={userConfig.currentBranche}
          brancheList={userConfig.branches}
          setBranche={handleChangeBranche}
          buttonMenu={!openDrawerMobile && !matches}
          buttonMenuAction={() => setOpenDrawerMobile(true)}
          showLogoutButton={
            userConfig ? getUserModuleList(userConfig).length < 2 : false
          }
        />
        {loading ? (
          <LinearProgress />
        ) : (
          <main className={classes.content} style={{ overflow: "auto" }}>
            <Container
              maxWidth="lg"
              className={classes.container}
              style={{ padding: "8px", height: "calc(100% - 85px)" }}
            >
              {getContentComponent(menu)}
            </Container>
          </main>
        )}
      </div>
      <SimpleAlerts values={state} onClose={onClose} />
    </div>
  );
}

const useStylesAlert = makeStyles((theme) => ({
  root: {
    position: "absolute",
    maxWidth: "400px",
    zIndex: "2000",
    right: "0",
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

function SimpleAlerts({ values, onClose }) {
  const classes = useStylesAlert();

  if (!values.error) return null;
  return (
    <div className={classes.root}>
      <Alert severity={values.type} onClose={() => onClose()}>
        {values.message}
      </Alert>
    </div>
  );
}
