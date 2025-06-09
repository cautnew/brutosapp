import * as React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #ff844c",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({ open, handleClose, handleOnClickAction }) {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            Tem certeza que deseja sair ?
          </Typography>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="secondary"
              //   className={classes.submit}
              onClick={handleClose}
            >
              Não
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              //   className={classes.submit}
              onClick={handleOnClickAction}
            >
              Sim
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
