import React from "react"
import { Typography } from "@material-ui/core"
import { formatCurrency } from "utils/formatters"
import useSWR from "swr"
import axios from "axios"
import { toast } from "react-toastify"

interface Props {
  pid: string | string[]
  basketname: string | string[]
}

const StatsView: React.FC<Props> = ({ pid, basketname }) => {
  const fetchData = async () => {
    try {
      const { data: max } = await axios.get(
        `/api/transaction/all/${pid}/${basketname}/max`
      )
      const { data: min } = await axios.get(
        `/api/transaction/all/${pid}/${basketname}/min`
      )
      const { data: avg } = await axios.get(
        `/api/transaction/all/${pid}/${basketname}/avg`
      )
      const { data: count } = await axios.get(
        `/api/transaction/all/${pid}/${basketname}/count`
      )
      const data = {
        max: max[0].max,
        min: min[0].min,
        avg: avg[0].avg,
        count: count[0].count,
      }
      return data
    } catch (err) {
      toast.error("Failed to fetch Stats")
    }
  }

  const { data: transactionData } = useSWR("fetchData", fetchData)

  return (
    <>
      <Typography variant="h4">Stats</Typography>
      <Typography variant="h6">
        Highest Transacted Commodity Price:{" "}
        <Typography variant="h6" style={{ fontWeight: 600 }} display="inline">
          {transactionData?.max && formatCurrency(transactionData?.max)}
        </Typography>
      </Typography>
      <Typography variant="h6">
        Lowest Transacted Commodity Price:{" "}
        <Typography variant="h6" style={{ fontWeight: 600 }} display="inline">
          {transactionData?.min && formatCurrency(transactionData?.min)}
        </Typography>
      </Typography>
      <Typography variant="h6">
        Average Price of All Transactions:{" "}
        <Typography variant="h6" style={{ fontWeight: 600 }} display="inline">
          {transactionData?.avg && formatCurrency(transactionData?.avg)}
        </Typography>
      </Typography>
      <Typography variant="h6">
        Number of Transactions:{" "}
        <Typography variant="h6" style={{ fontWeight: 600 }} display="inline">
          {transactionData?.count}
        </Typography>
      </Typography>
    </>
  )
}

export default React.memo(StatsView)
