import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { VisibilityOutlined } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  table: {
    width: "100%",
  },
}));

export default function SimpleTable({
  list,
  colunmList,
  handleChangeContentDelete,
  handleChangeContentEdit,
  visibleIcon,
}) {
  const classes = useStyles();
  // const [checked, setChecked] = React.useState([0]);
  console.log("@@@ list", list);

  if (!list || !list.length) return null;

  return (
    <TableContainer
      component={Paper}
      style={{ width: "100%", paddingLeft: "0px", margin: "10px 0px" }}
    >
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {colunmList.map((e) => (
              <TableCell align="left">
                <Typography variant="h6">{e.name}</Typography>
              </TableCell>
            ))}
            {visibleIcon && (
              <TableCell align="center">
                <Typography variant="h6">Visualizar</Typography>
              </TableCell>
            )}
            <TableCell align="right">
              <Typography variant="h6">Editar </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="h6">Excluir </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((item) => (
            <TableRow key={item.name}>
              {colunmList.map((elem) => (
                <TableCell align="left" component="th" scope="row">
                  <Typography variant="subtitle1">{item[elem.key]}</Typography>
                </TableCell>
              ))}
              {/* <TableCell align="left">
                <Typography variant="subtitle1">{item.accessCode}</Typography>
              </TableCell> */}
              {visibleIcon && (
                <TableCell align="center">
                  <IconButton
                    edge="end"
                    aria-label="comments"
                    onClick={() => handleChangeContentEdit(item.id)}
                  >
                    <VisibilityOutlined />
                  </IconButton>
                </TableCell>
              )}
              <TableCell align="right">
                <IconButton
                  edge="end"
                  aria-label="comments"
                  onClick={() => handleChangeContentEdit(item.id)}
                >
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell align="right">
                {" "}
                <IconButton
                  onClick={() => handleChangeContentDelete(item.id)}
                  edge="end"
                  aria-label="comments"
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    // <ListItem
    //   key={id}
    //   role={undefined}
    //   style={{ width: "100%", paddingLeft: "0px" }}
    // >
    //   <Typography
    //     variant="h5"
    //     style={{
    //       display: "flex",
    //       width: "100%",
    //       justifyContent: "space-between",
    //       alignItems: "center",
    //       height: "50px",
    //     }}
    //   >
    //     <Typography variant="h6">{name}</Typography>
    //   </Typography>
    //   <ListItemSecondaryAction>
    //     <IconButton
    //       edge="end"
    //       aria-label="comments"
    //       onClick={() => handleChangeContentEdit(id)}
    //     >
    //       <EditIcon />
    //     </IconButton>
    //     <IconButton
    //       onClick={() => handleChangeContentDelete(id)}
    //       edge="end"
    //       aria-label="comments"
    //     >
    //       <DeleteOutlineIcon />
    //     </IconButton>
    //   </ListItemSecondaryAction>
    // </ListItem>
  );
  //     })}
  //   </List>
  // );
}
