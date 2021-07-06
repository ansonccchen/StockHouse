import React, { Dispatch, SetStateAction, useState } from "react"
import { Button, DialogContentText, Typography } from "@material-ui/core"
import { Dialog, DialogContent, DialogActions } from "@material-ui/core"
import axios from "axios"
import { toast } from "react-toastify"
import Div from "../Div"

interface Props {
  deleteId: { pid: number; title: string }
  refetchUser: () => void
  setOpen: Dispatch<SetStateAction<{ pid: number; title: string }>>
}

const DeletePortfolioDialog: React.FC<Props> = ({
  deleteId,
  refetchUser,
  setOpen,
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeletePortfolio = async () => {
    if (isDeleting) return
    setIsDeleting(true)

    try {
      await axios.delete(`/api/portfolio/${deleteId?.pid}`)
      refetchUser()
      toast.success("Portfolio deleted!")
      setOpen(undefined)
    } catch (err) {
      toast.error(err?.response?.data?.message || "Unknown error occured")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={deleteId != null} onClose={() => setOpen(undefined)}>
      <Div ml={24} mt={16}>
        <Typography variant="h5">Delete {deleteId?.title}?</Typography>
      </Div>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this Portfolio? This will delete all
          Baskets created under it and their transactions.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(undefined)}>Cancel</Button>
        <Button onClick={handleDeletePortfolio} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default React.memo(DeletePortfolioDialog)
