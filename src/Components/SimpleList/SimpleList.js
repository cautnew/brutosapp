import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { Divider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SimpleList({
  list,
  handleChangeContentDelete,
  handleChangeContentEdit,
}) {
  const classes = useStyles();
  // const [checked, setChecked] = React.useState([0]);
  // console.log("@@@ list", list);

  if (!list || !list.length) return null;
  return (
    <List className={classes.root}>
      {list.map(({ id, name }) => {
        const labelId = `checkbox-list-label-${id}`;

        return (
          <>
            <Divider />

            <ListItem
              key={id}
              role={undefined}
              style={{ width: "100%", paddingLeft: "0px"}}
            >
              <Typography
                variant="h5"
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginRight: "56px",
                }}
              >
                <Typography variant="h6">{name}</Typography>
              </Typography>
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="comments"
                  onClick={() => handleChangeContentEdit(id)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleChangeContentDelete(id)}
                  edge="end"
                  aria-label="comments"
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </>
        );
      })}
    </List>
  );
}
