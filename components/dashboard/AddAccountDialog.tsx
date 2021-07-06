import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { TextField, Button, Autocomplete } from "@material-ui/core"
import axios from "axios"
import { toast } from "react-toastify"
import Div from "../Div"
import CustomDialog from "../CustomDialog"

interface Props {
  openAddAccount: boolean
  setOpenAddAccount: Dispatch<SetStateAction<boolean>>
  refetchUser: () => void
}

let TRADING_PLATFORMS = []

const AddAccountDialog: React.FC<Props> = ({
  openAddAccount,
  setOpenAddAccount,
  refetchUser,
}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [accountType, setAccountType] = useState("")
  const [tradingPlatforms, setTradingPlatforms] = useState([])

  useEffect(() => {
    if (openAddAccount) {
      setAccountType("")
      setTradingPlatforms([])
    }

    const fetchTradingPlatforms = async () => {
      const { data } = await axios.get("api/tradingplatform")
      TRADING_PLATFORMS = data
    }

    if (TRADING_PLATFORMS.length === 0) {
      fetchTradingPlatforms()
    }
  }, [openAddAccount])

  const handleAdd = async () => {
    if (isAdding) return
    if (tradingPlatforms.length === 0) {
      toast.error("Please select a Trading Platform!")
      return
    }
    setIsAdding(true)

    try {
      await axios.post("/api/account", {
        accounttype: accountType,
        tradingplatforms: tradingPlatforms.map(platform => platform.name),
      })
      refetchUser()
      toast.success("Account added!")
      setOpenAddAccount(false)
    } catch (err) {
      toast.error(err?.response?.data?.message || "Unknown error occured")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <CustomDialog
      open={openAddAccount}
      onClose={() => setOpenAddAccount(false)}
      title="Add Account"
      onFormSubmit={handleAdd}
    >
      <TextField
        label="Account Type"
        onChange={e => setAccountType(e.target.value)}
        type="text"
        value={accountType}
        variant="outlined"
        required
      />
      <Div h={16} />
      <Autocomplete
        autoHighlight
        filterSelectedOptions
        getOptionLabel={option => option.name}
        onChange={(event, value) => setTradingPlatforms(value)}
        multiple
        options={TRADING_PLATFORMS}
        renderInput={params => (
          <TextField {...params} label="Trading Platform *" />
        )}
      />
      <Div h={16} />
      <Button
        disabled={isAdding}
        disableRipple
        size="large"
        variant="contained"
        type="submit"
      >
        {isAdding ? "Adding..." : "Add"}
      </Button>
    </CustomDialog>
  )
}

export default React.memo(AddAccountDialog)
