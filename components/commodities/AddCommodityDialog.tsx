import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { InputLabel, MenuItem, FormControl, Select } from "@material-ui/core"
import { TextField, Button } from "@material-ui/core"
import Div from "../Div"
import CustomDialog from "../CustomDialog"
import axios from "axios"
import { toast } from "react-toastify"

interface Props {
  openAddCommodity: boolean
  setOpenAddCommodity: Dispatch<SetStateAction<boolean>>
  handleApplyFilter: () => Promise<void>
}

const AddCommodityDialog: React.FC<Props> = ({
  setOpenAddCommodity,
  openAddCommodity,
  handleApplyFilter,
}) => {
  const [customPrice, setCustomPrice] = useState(undefined)
  const [exchange, setExchange] = useState("")
  const [name, setName] = useState("")
  const [ticker, setTicker] = useState("")
  const [type, setType] =
    useState<"" | "stocks" | "forex" | "other" | "crypto">("")
  const [cryptoSymbol, setCryptoSymbol] = useState("")
  const [forexSymbol, setForexSymbol] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  // const [description, setDescription] = useState("")

  useEffect(() => {
    if (openAddCommodity) {
      setCustomPrice(undefined)
      setExchange("")
      setName("")
      setTicker("")
      setType("")
      setCryptoSymbol("")
      // setDescription("")
    }
  }, [openAddCommodity])

  const handleAddCommodity = async () => {
    if (isAdding) return
    setIsAdding(true)

    try {
      await axios.post("/api/commodity", {
        price: customPrice || null,
        type,
        name,
        ticker,
        exchange,
        symbol:
          type === "crypto"
            ? cryptoSymbol
            : type === "forex"
            ? forexSymbol
            : null,
        description: type === "other" ? name : null,
      })
      await handleApplyFilter()
      toast.success("Commodity Added!")
      setOpenAddCommodity(false)
    } catch (err) {
      toast.error(err?.response?.data?.message || "Unknown error occured")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <CustomDialog
      open={openAddCommodity}
      onClose={() => setOpenAddCommodity(false)}
      title="Add Commodity"
      onFormSubmit={handleAddCommodity}
    >
      <Div alignItemsCenter row>
        <Div fill>
          <TextField
            label="Name"
            onChange={e => setName(e.target.value)}
            type="text"
            value={name}
            variant="outlined"
            required
          />
        </Div>
        <Div w={16} />
        <Div fill>
          <FormControl variant="outlined">
            <InputLabel>Type *</InputLabel>
            <Select
              value={type}
              onChange={e => setType(e.target.value)}
              label="Type"
              required
            >
              {["stocks", "crypto", "forex", "other"].map((type, index) => {
                return (
                  <MenuItem key={index} value={type}>
                    {type}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </Div>
      </Div>
      {type && <Div h={16} />}
      {type === "stocks" ? (
        <Div row>
          <TextField
            label="Ticker"
            onChange={e => setTicker(e.target.value)}
            type="text"
            value={ticker}
            variant="outlined"
            required
            inputProps={{ maxLength: 6 }}
          />
          <Div w={16} />
          <TextField
            label="Exchange"
            onChange={e => setExchange(e.target.value)}
            type="text"
            value={exchange}
            variant="outlined"
            required
            inputProps={{ maxLength: 20 }}
          />
        </Div>
      ) : type === "crypto" ? (
        <TextField
          label="Symbol"
          onChange={e => setCryptoSymbol(e.target.value)}
          type="text"
          value={cryptoSymbol}
          variant="outlined"
          required
          inputProps={{ maxLength: 5 }}
        />
      ) : type === "forex" ? (
        <TextField
          label="Symbol"
          onChange={e => setForexSymbol(e.target.value)}
          type="text"
          value={forexSymbol}
          variant="outlined"
          required
          inputProps={{ maxLength: 7 }}
        />
      ) : type === "other" ? (
        <TextField
          label="Price"
          onChange={e => setCustomPrice(e.target.value)}
          type="number"
          value={customPrice}
          variant="outlined"
        />
      ) : null}
      <Div h={16} />
      <Button
        disableRipple
        variant="contained"
        size="large"
        type="submit"
        disabled={isAdding}
      >
        {isAdding ? "Adding..." : "Add"}
      </Button>
    </CustomDialog>
  )
}

export default React.memo(AddCommodityDialog)
