import React, { Dispatch, SetStateAction } from "react"
import { Account, Commodity, Transaction } from "interfaces"
import { TableBody, TableCell, TableContainer, Table } from "@material-ui/core"
import { TableRow, TableHead, Paper, IconButton } from "@material-ui/core"
import { formatCurrency, formatDate } from "utils/formatters"
import DeleteIcon from "@material-ui/icons/Delete"

interface Props {
  transactions: [(Transaction & Commodity & Account)?]
  setDeleteTransactionId: Dispatch<SetStateAction<Number>>
}

const AllTransactionsTable: React.FC<Props> = ({
  transactions,
  setDeleteTransactionId,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Action</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Commoditiy</TableCell>
            <TableCell align="right">Account</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map(
            (transaction: Transaction & Commodity & Account) => (
              <TableRow key={transaction.tid}>
                <TableCell component="th" scope="row">
                  {formatDate(transaction.transactiondate)}
                </TableCell>
                <TableCell align="right">
                  {transaction.transactiontype}
                </TableCell>
                <TableCell align="right">{transaction.quantity}</TableCell>
                <TableCell align="right">
                  {formatCurrency(transaction.price)}
                </TableCell>
                <TableCell align="right">{transaction.description}</TableCell>
                <TableCell align="right">{transaction.accounttype}</TableCell>
                <TableCell align="right">
                  {formatCurrency(transaction.price * transaction.quantity)}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    disableRipple
                    size="small"
                    onClick={() => setDeleteTransactionId(transaction.tid)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default AllTransactionsTable
