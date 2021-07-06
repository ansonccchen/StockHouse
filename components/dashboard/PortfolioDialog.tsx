import React, { SetStateAction, useEffect, useState } from "react"
import CustomDialog from "../CustomDialog"
import { Button, Box, TextField } from "@material-ui/core"
import axios from "axios"
import { toast } from "react-toastify"
import { Portfolio } from "interfaces"

interface Props {
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  actionType: "create" | "edit"
  editedPortfolio?: Portfolio
  refetchUser: () => void
}

const PortfolioDialog: React.FunctionComponent<Props> = ({
  actionType,
  isOpen,
  setIsOpen,
  editedPortfolio,
  refetchUser,
}) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const resetInputs = () => {
    setTitle("")
    setDescription("")
  }

  useEffect(() => {
    if (isOpen && actionType !== "edit") {
      resetInputs()
    }
  }, [isOpen])

  useEffect(() => {
    if (editedPortfolio) {
      setTitle(editedPortfolio.title)
      setDescription(editedPortfolio.description)
    }
  }, [editedPortfolio])

  const handleSubmit = async () => {
    if (isAdding) return
    setIsAdding(true)

    try {
      if (actionType === "create") {
        await axios.post("/api/portfolio", {
          title,
          description,
        })
      } else {
        await axios.patch(`/api/portfolio/${editedPortfolio.pid}`, {
          title,
          description,
        })
      }
      // resetInputs()
      setIsOpen(false)
      if (actionType === "create") {
        toast.success("Portfolio added!")
      } else if (actionType === "edit") {
        toast.success("Portfolio edit saved!")
      }
      refetchUser()
    } catch (err) {
      toast.error(err?.response?.data?.message || "Unknown error occured")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <CustomDialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      title={`${actionType === "edit" ? "Edit" : "Create"} Portfolio`}
      onFormSubmit={handleSubmit}
    >
      <TextField
        label="Title"
        onChange={e => setTitle(e.target.value)}
        type="text"
        value={title}
        variant="outlined"
        required
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Description"
        onChange={e => setDescription(e.target.value)}
        type="text"
        value={description}
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
        disabled={isAdding}
      >
        {actionType === "edit"
          ? isAdding
            ? "Saving..."
            : "Save"
          : isAdding
          ? "Creating..."
          : "Create"}
      </Button>
    </CustomDialog>
  )
}
export default React.memo(PortfolioDialog)
