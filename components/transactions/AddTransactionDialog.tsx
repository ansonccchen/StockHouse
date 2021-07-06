import React, { SetStateAction, useEffect, useState } from "react"
import CustomDialog from "../CustomDialog"
import { Button, Box, TextField, Select, MenuItem, FormControl, InputLabel } from "@material-ui/core"
import axios from "axios"
import { toast } from "react-toastify"
import useSWR, { mutate } from "swr"
import { useRouter } from "next/router"
import Autocomplete from "@material-ui/core/Autocomplete"
import { Account, CommoditySummary, Currency } from "interfaces"

interface Props {
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  basketName: string,
  portfolioId: number
}

const AddTransactionDialog: React.FunctionComponent<Props> = ({
  isOpen,
  setIsOpen,
  basketName,
  portfolioId
}) => {
  const router = useRouter()
  const [price, setPrice] = useState<number | null>(null)
  const [fees, setFees] = useState<number | null>(null)
  const [quantity, setQuantity] = useState<number | null>(null)
  const [transactionType, setTransactionType] = React.useState<string>("BUY");
  const [commodityId, setCommodityId] = React.useState<number | null>(null);
  const [currency, setCurrency] = React.useState<string | null>(null);
  const [accountId, setAccountId] = React.useState<number | null>(null);

  const fetchData = async () => {
    try {
      const [
        { data: commodities },
        { data: currencies },
        { data: accounts }
      ] = await Promise.all([
        axios.get("/api/commodity"),
        axios.get("/api/currency"),
        axios.get("/api/account")
      ])
      return {
        commodities,
        currencies,
        accounts
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        router.push("/login")
      } else {
        toast.error("failed to fetch data")
      }
    }
  }

  const { data, error } = useSWR('transaction-stuff', fetchData)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetInputs = () => {
    setPrice(null)
    setFees(null)
    setQuantity(null)
    setTransactionType("BUY")
    setCommodityId(null)
    setCurrency(null)
    setAccountId(null)
  }

  useEffect(() => {
    resetInputs()
  }, [isOpen])


  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      await axios.post("/api/transaction", {
        price,
        fees,
        quantity,
        transactionType,
        commodityId,
        currency,
        accountId,
        basketName,
        portfolioId
      })
      setIsOpen(false)
      toast.success("Transaction added!")
      mutate("basket")
    } catch (err) {
      toast.error(err?.response?.data?.message || "Unknown error occured")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CustomDialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      title="Add Transaction"
      onFormSubmit={handleSubmit}
    >
      <FormControl fullWidth>
        <InputLabel id="transaction-type">Action</InputLabel>
        <Select
          labelId="transaction-type"
          value={transactionType}
          label="Action"
          onChange={(e) => setTransactionType(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="BUY">Buy</MenuItem>
          <MenuItem value="SELL">Sell</MenuItem>
        </Select>
      </FormControl>
      <Autocomplete
        options={data?.commodities ?? []}
        getOptionLabel={(option: CommoditySummary) => `${option.name} - ${option.prettyname}`}
        renderInput={(params) => <TextField required {...params} label="Commodity" />}
        onChange={(event: any, commodity: CommoditySummary | null) => {
          setCommodityId(Number(commodity?.cid) || null);
        }}
        sx={{ mb: 2 }}
      />
      <Autocomplete
        options={data?.currencies ?? []}
        getOptionLabel={(option: Currency) => option.isocode}
        renderInput={(params) => <TextField required {...params} label="Currency" />}
        onChange={(event: any, currency: Currency | null) => {
          setCurrency(currency?.isocode ?? null);
        }}
        sx={{ mb: 2 }}
      />
      <Autocomplete
        options={data?.accounts ?? []}
        getOptionLabel={(option: Account) => option.accounttype}
        renderInput={(params) => <TextField {...params} label="Account" />}
        onChange={(event: any, account: Account | null) => {
          setAccountId(Number(account?.id) || null);
        }}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Price"
        onChange={e => setPrice(Number(e.target.value))}
        type="number"
        value={price}
        variant="outlined"
        required
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Fees"
        onChange={e => setFees(Number(e.target.value))}
        type="number"
        value={fees}
        variant="outlined"
        required
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Quantity"
        onChange={e => setQuantity(Number(e.target.value))}
        type="number"
        value={quantity}
        variant="outlined"
        required
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button
        type="submit"
        variant="contained"
        size="large"
        disableRipple
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Adding..."
          : "Add"}
      </Button>
    </CustomDialog>
  )
}
export default React.memo(AddTransactionDialog)
