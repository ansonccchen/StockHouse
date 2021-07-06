import React, { useState } from "react"
import { Autocomplete, Typography, TextField, Button } from "@material-ui/core"
import { formatCurrency } from "utils/formatters"
import { Div } from "components"
import axios from "axios"
import { toast } from "react-toastify"

interface Props {
  pid: string | string[]
  basketname: string | string[]
}
const columnOptions = [
  { column: "Price", id: "price" },
  { column: "Quantity", id: "quantity" },
  { column: "Fees", id: "fees" },
]
const actionOptions = [
  { action: "Highest", id: "max" },
  { action: "Lowest", id: "min" },
  { action: "Average", id: "avg" },
]
let fetchedColumn = null

const StatsViewV2: React.FC<Props> = ({ pid, basketname }) => {
  const [selectedColumn, setSelectedColumn] = useState(undefined)
  const [selectedAction, setSelectedAction] = useState(undefined)
  const [fetchedData, setFetchedData] = useState(undefined)
  const [isFetching, setIsFetching] = useState(false)

  const fetchData = async () => {
    if (isFetching) return
    setIsFetching(true)

    try {
      const { data } = await axios.get(
        `/api/transaction/all/${pid}/${basketname}/${selectedAction}/${selectedColumn}`
      )
      fetchedColumn = selectedColumn
      setFetchedData(data)
    } catch (err) {
      toast.error("Failed to fetch Stats")
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <>
      <Typography variant="h4">Stats</Typography>
      <Div row alignItemsCenter>
        <Div fill>
          <Autocomplete
            disablePortal
            onChange={(event, value) => setSelectedColumn((value as any)?.id)}
            options={columnOptions}
            getOptionLabel={option => option.column}
            renderInput={params => <TextField {...params} label="Column" />}
          />
        </Div>
        <Div w={16} />
        <Div fill>
          <Autocomplete
            disablePortal
            onChange={(event, value) => setSelectedAction((value as any)?.id)}
            options={actionOptions}
            getOptionLabel={option => option.action}
            renderInput={params => <TextField {...params} label="Action" />}
          />
        </Div>
        <Div w={16} />
      </Div>
      <Div h={16} />
      <Div style={{ flex: 0 }} row alignItemsCenter justifyContentBetween>
        <Div>
          {fetchedData != null && (
            <Typography variant="h6">
              Fetched Stats:{" "}
              {fetchedColumn === "quantity"
                ? Math.floor(fetchedData)
                : formatCurrency(fetchedData)}
            </Typography>
          )}
        </Div>
        <Button
          disableRipple
          onClick={fetchData}
          size="large"
          variant="contained"
          disabled={isFetching}
        >
          {isFetching ? "Fetching..." : "Get Stats"}
        </Button>
      </Div>
    </>
  )
}

export default React.memo(StatsViewV2)
