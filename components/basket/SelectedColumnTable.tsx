import React, { useState, useEffect } from "react"
import { TableBody, TableCell, TableContainer, Table } from "@material-ui/core"
import { TableRow, TableHead, Paper, CircularProgress } from "@material-ui/core"
import { Radio, RadioGroup, FormControlLabel } from "@material-ui/core"
import { formatCurrency, formatDate } from "utils/formatters"
import axios from "axios"
import { toast } from "react-toastify"
import { Div } from "components"

interface Props {
  pid
  basketname
}

const SelectedColumnTable: React.FC<Props> = ({ pid, basketname }) => {
  const [selectedColumn, setSelectedColumn] =
    useState<
      | "transactiondate"
      | "transactiontype"
      | "quantity"
      | "price"
      | "accounttype"
    >("price")
  const [transactions, setTransactions] = useState(undefined)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSingleColumn = async column => {
    setIsLoading(true)
    try {
      const { data } = await axios.get(
        `/api/transaction/all/${pid}/${basketname}/projection/${column}`
      )
      setTransactions(data)
      setIsLoading(false)
      return data
    } catch (err) {
      toast.error("Failed to fetch Column")
    }
  }

  useEffect(() => {
    fetchSingleColumn(selectedColumn)
  }, [selectedColumn])

  return (
    <>
      <Div mb={8}>
        <RadioGroup
          row
          defaultValue="price"
          onChange={e =>
            setSelectedColumn(
              e.target.value as
                | "transactiondate"
                | "transactiontype"
                | "quantity"
                | "price"
                | "accounttype"
            )
          }
        >
          <FormControlLabel
            value="price"
            control={<Radio color="primary" />}
            label="Price"
            labelPlacement="end"
          />
          <FormControlLabel
            value="transactiontype"
            control={<Radio color="primary" />}
            label="Action"
            labelPlacement="end"
          />
          <FormControlLabel
            value="quantity"
            control={<Radio color="primary" />}
            label="Quantity"
            labelPlacement="end"
          />
          <FormControlLabel
            value="accounttype"
            control={<Radio color="primary" />}
            label="Account"
            labelPlacement="end"
          />
          <FormControlLabel
            value="transactiondate"
            control={<Radio color="primary" />}
            label="Date"
            labelPlacement="end"
          />
        </RadioGroup>
      </Div>
      {isLoading ? (
        <Div center>
          <CircularProgress />
        </Div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Commodity</TableCell>
                {selectedColumn === "transactiontype" && (
                  <TableCell align="center">Action</TableCell>
                )}
                {selectedColumn === "quantity" && (
                  <TableCell align="center">Quantity</TableCell>
                )}
                {selectedColumn === "accounttype" && (
                  <TableCell align="center">Account</TableCell>
                )}
                {selectedColumn === "price" && (
                  <TableCell align="center">Price</TableCell>
                )}
                {selectedColumn === "transactiondate" && (
                  <TableCell align="center">Date</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions?.map((transaction, index) => (
                <TableRow key={String(index)}>
                  <TableCell align="center">
                    {transaction.description}
                  </TableCell>
                  {selectedColumn === "transactiontype" && (
                    <TableCell align="center">
                      {transaction.transactiontype}
                    </TableCell>
                  )}
                  {selectedColumn === "quantity" && (
                    <TableCell align="center">{transaction.quantity}</TableCell>
                  )}
                  {selectedColumn === "accounttype" && (
                    <TableCell align="center">
                      {transaction.accounttype}
                    </TableCell>
                  )}
                  {selectedColumn === "price" && (
                    <TableCell align="center">
                      {formatCurrency(transaction.price)}
                    </TableCell>
                  )}
                  {selectedColumn === "transactiondate" && (
                    <TableCell align="center">
                      {formatDate(transaction.transactiondate)}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  )
}

export default React.memo(SelectedColumnTable)
