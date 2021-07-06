import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { TextField, Button } from "@material-ui/core"
import Div from "../Div"
import axios from "axios"
import { toast } from "react-toastify"
import CustomDialog from "../CustomDialog"
import { useRouter } from "next/router"
import { mutate } from "swr"

interface Props {
  openAddBasket: boolean
  setOpenAddBasket: Dispatch<SetStateAction<boolean>>
}

const AddBasketDialog: React.FC<Props> = ({
  openAddBasket,
  setOpenAddBasket,
}) => {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (openAddBasket) {
      setName("")
      setDescription("")
    }
  }, [openAddBasket])

  const handleAddBasket = async () => {
    if (isCreating) return
    setIsCreating(true)

    try {
      await axios.post(`/api/basket/${router.query?.pID}`, {
        name,
        description,
      })
      toast.success("Created Basket!")
      setOpenAddBasket(false)
      mutate("portfolio")
    } catch (err) {
      toast.error(err?.response?.data?.message || "Unknown error occured")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <CustomDialog
      open={openAddBasket}
      onClose={() => setOpenAddBasket(false)}
      title="Create Basket"
      onFormSubmit={handleAddBasket}
    >
      <TextField
        label="Name"
        onChange={e => setName(e.target.value)}
        required
        type="text"
        value={name}
        variant="outlined"
      />
      <Div h={16} />
      <TextField
        label="Description"
        onChange={e => setDescription(e.target.value)}
        type="text"
        value={description}
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
        {isCreating ? "Creating..." : "Create"}
      </Button>
    </CustomDialog>
  )
}
export default React.memo(AddBasketDialog)
