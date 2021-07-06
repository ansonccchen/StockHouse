import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { TextField, Button } from "@material-ui/core"
import Div from "../Div"
import CustomDialog from "../CustomDialog"
import axios from "axios"
import { toast } from "react-toastify"

interface Props {
  openAddPortfolio: boolean
  setOpenAddPortfolio: Dispatch<SetStateAction<boolean>>
}

const AddPortfolioDialog: React.FC<Props> = ({
  openAddPortfolio,
  setOpenAddPortfolio,
}) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = async () => {
    if (isAdding) return
    setIsAdding(true)

    try {
      await axios.post("/api/portfolio", {
        title,
        description,
      })
      toast.success("Portfolio added!")
      setOpenAddPortfolio(false)
    } catch (err) {
      toast.error(err?.response?.data?.message || "Unknown error occured")
    } finally {
      setIsAdding(false)
    }
  }

  useEffect(() => {
    if (openAddPortfolio) {
      setTitle("")
      setDescription("")
    }
  }, [openAddPortfolio])

  return (
    <CustomDialog
      onClose={() => setOpenAddPortfolio(false)}
      open={openAddPortfolio}
      title="Add Portfolio"
      onFormSubmit={handleAdd}
    >
      <TextField
        label="Title"
        onChange={e => setTitle(e.target.value)}
        required
        type="text"
        value={title}
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
        disabled={isAdding}
        disableRipple
        size="large"
        type="submit"
        variant="contained"
      >
        {isAdding ? "Adding..." : "Add"}
      </Button>
    </CustomDialog>
  )
}

export default React.memo(AddPortfolioDialog)
