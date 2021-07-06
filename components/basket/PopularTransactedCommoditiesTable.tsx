import React, { useCallback, useState } from "react"
import { TableBody, TableCell, TableContainer, Table, FormControl, InputLabel, MenuItem, Select, TextField } from "@material-ui/core"
import { TableRow, TableHead, Paper, CircularProgress } from "@material-ui/core"
import { formatCurrency } from "utils/formatters"
import useSWR, { mutate } from "swr"
import axios from "axios"
import { toast } from "react-toastify"
import { Div } from "components"
import Typography from "@material-ui/core/Typography"
import { type } from "os"

interface Props {
  pid: string | string[]
  basketname: string | string[]
}

const PopularTransactedCommoditiesTable: React.FC<Props> = ({
  pid,
  basketname,
}) => {
  const [minAmount, setMinAmount] = useState(1)
  const [groupBy, setGroupBy] = useState<'' | 'transactiontype' | 'currency' | 'accountid'>('')

  const fetchPopularTransactedCommodities = async (minAmount, groupBy) => {
    try {
      const { data } = await axios.get(
        `/api/transaction/all/${pid}/${basketname}/grouped`,
        {
          params: {
            minAmount,
            groupBy
          }
        }
      )
      return data
    } catch (err) {
      toast.error("Failed to fetch Frequent Transacted Commodities")
    }
  }

  const { data: popularTransactedCommodities } = useSWR(
    [minAmount, groupBy],
    fetchPopularTransactedCommodities
  )

  return (
    <>
      <span>
        <TextField
          label="Minimum Amount"
          onChange={e => {
            setMinAmount(Number(e.target.value))
            mutate('popularTransactedCommodities')
          }}
          type="number"
          value={minAmount}
          variant="outlined"
        />
        <FormControl sx={{ ml: 2, minWidth: '200px' }} variant="outlined">
          <InputLabel>Group by</InputLabel>
          <Select
            value={groupBy}
            onChange={e => {
              setGroupBy(e.target.value)
              mutate('popularTransactedCommodities')
            }}
            label="Group by"
            required
          >
            {['', 'transactiontype', 'currency', 'accountid'].map((type, index) => {
              return (
                <MenuItem key={index} value={type}>
                  {type || 'None'}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
      </span>
      <Typography variant="body1">These are all transactions that have a minimum of {minAmount} trade(s) grouped by commodity {groupBy && `and ${groupBy}`} and their aggregated statistics</Typography>
      {popularTransactedCommodities == null ? (
        <Div center>
          <CircularProgress />
        </Div>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Commodity</TableCell>
                  <TableCell align="right">{groupBy}</TableCell>
                  <TableCell align="right">Number of transactions</TableCell>
                  <TableCell align="right">Average Price</TableCell>
                  <TableCell align="right">Average Fees</TableCell>
                  <TableCell align="right">Average Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {popularTransactedCommodities?.map((commodity, index) => (
                  <TableRow key={String(index)}>
                    <TableCell component="th" scope="row">
                      {commodity.description}
                    </TableCell>
                    <TableCell align="right">
                      {commodity.groupbycolumn}
                    </TableCell>
                    <TableCell align="right">{commodity.count}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(commodity.avgprice)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(commodity.avgfees)}
                    </TableCell>
                    <TableCell align="right">
                      {Math.floor(Number(commodity.avgquantity))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  )
}

export default React.memo(PopularTransactedCommoditiesTable)
