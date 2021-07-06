import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { TextField, Button } from "@material-ui/core"
import Div from "../Div"
import axios from "axios"
import { toast } from "react-toastify"
import CustomDialog from "../CustomDialog"

interface Props {
  openCreateAccount: boolean
  setOpenCreateAccount: Dispatch<SetStateAction<boolean>>
}

const CreateAccoutDialog: React.FC<Props> = ({
  setOpenCreateAccount,
  openCreateAccount,
}) => {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [houseNumber, setHouseNumber] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [province, setProvince] = useState("")
  const [streetName, setStreetName] = useState("")
  const [unitNumber, setUnitNumber] = useState("")

  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (openCreateAccount) {
      setEmail("")
      setFirstName("")
      setHouseNumber("")
      setLastName("")
      setPassword("")
      setPhone("")
      setPostalCode("")
      setProvince("")
      setStreetName("")
      setUnitNumber("")
    }
  }, [openCreateAccount])

  const handleCreateAccount = async () => {
    if (isCreating) return
    setIsCreating(true)

    try {
      await axios.post("/api/auth/signup", {
        email,
        firstname: firstName,
        housenumber: houseNumber,
        lastname: lastName,
        password,
        phone,
        postalcode: postalCode,
        province,
        streetname: streetName,
        unitnumber: unitNumber,
      })
      toast.success("Account created!")
      setOpenCreateAccount(false)
    } catch (err) {
      toast.error(err?.response?.data?.message || "Unknown error occured")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <CustomDialog
      open={openCreateAccount}
      onClose={() => setOpenCreateAccount(false)}
      title="Sign up"
      onFormSubmit={handleCreateAccount}
    >
      <Div row mb={16}>
        <TextField
          label="First Name"
          onChange={e => setFirstName(e.target.value)}
          type="text"
          value={firstName}
          variant="outlined"
        />
        <Div w={16} />
        <TextField
          label="Last Name"
          onChange={e => setLastName(e.target.value)}
          type="text"
          value={lastName}
          variant="outlined"
        />
      </Div>
      <TextField
        label="Phone"
        onChange={e => setPhone(e.target.value)}
        type="text"
        value={phone}
        variant="outlined"
      />

      <Div h={16} />
      <Div row>
        <TextField
          label="House Number"
          onChange={e => setHouseNumber(e.target.value)}
          type="number"
          value={houseNumber}
          variant="outlined"
        />
        <Div w={16} />
        <TextField
          label="Street"
          onChange={e => setStreetName(e.target.value)}
          type="text"
          value={streetName}
          variant="outlined"
        />
      </Div>
      <Div h={16} />
      <Div row>
        <TextField
          label="Unit Number"
          onChange={e => setUnitNumber(e.target.value)}
          type="number"
          value={unitNumber}
          variant="outlined"
        />
        <Div w={16} />
        <TextField
          label="Postal Code"
          onChange={e => setPostalCode(e.target.value)}
          type="text"
          value={postalCode}
          variant="outlined"
          inputProps={{ maxLength: 12 }}
        />
      </Div>
      <Div h={16} />
      <TextField
        label="Province"
        onChange={e => setProvince(e.target.value)}
        type="text"
        value={province}
        variant="outlined"
      />
      <Div h={16} />
      <TextField
        autoComplete="email"
        label="Email"
        onChange={e => setEmail(e.target.value)}
        required
        type="email"
        value={email}
        variant="outlined"
      />
      <Div h={16} />
      <TextField
        autoComplete="current-password"
        label="Password"
        onChange={e => setPassword(e.target.value)}
        required
        type="password"
        value={password}
        variant="outlined"
      />
      <Div h={16} />
      <Button
        disabled={isCreating}
        disableRipple
        size="large"
        type="submit"
        variant="contained"
      >
        {isCreating ? "Signing up..." : "Sign up"}
      </Button>
    </CustomDialog>
  )
}

export default React.memo(CreateAccoutDialog)
