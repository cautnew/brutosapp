import React from "react";
import api from "../../services/api";
import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow, Typography,
} from "@material-ui/core";

export const ProductQuantityInAllBranches = (props) => {
  const { productId, startDate, endDate } = props;

  const [data, setData] = React.useState([]);
  const [totalEntryQuantities, setTotalEntryQuantities] = React.useState(0);

  React.useEffect(() => {
    const getQuantityOfAProductInAllBranches = async () => {
      let path = `/products/branchs?productId=${productId}`;
      if(startDate)
        path += `&StartDate=${startDate}`;

      if(endDate)
        path += `&EndDate=${endDate}`;

      const res = await api.get(path);
      setData(res.data);
      let entryQuantities = 0;
      res.data.forEach(element => entryQuantities += element.entryQuantity | 0);
      setTotalEntryQuantities(entryQuantities);
    };

    productId && getQuantityOfAProductInAllBranches();
  }, [productId]);

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <div style={{ width: "100%" }}>
        <Divider />
        <Typography
            variant="subtitle2"
            style={{
              color: "rgba(0, 0, 0, 0.77)",
              padding: "8px 0",
              marginLeft: "8px",
            }}
        >
          Total de Entradas: {totalEntryQuantities | 0}
        </Typography>
        <Divider />
      </div>
      <Table style={{
        width: "100%",
      }}>
        <TableHead>
          <TableRow>
              <TableCell>Loja</TableCell>
              <TableCell style={{textAlign: 'center'}}>Disponível</TableCell>
              <TableCell style={{textAlign: 'center'}}>Entradas</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {data.map((v) => (
            <TableRow key={v.branchId}>
                <TableCell>{v.branchName}</TableCell>
                <TableCell style={{textAlign: 'center'}}>{v.quantity}</TableCell>
                <TableCell style={{textAlign: 'center'}}>{v.entryQuantity | 0}</TableCell>
            </TableRow>
        ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductQuantityInAllBranches;
