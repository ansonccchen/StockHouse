import React, { Dispatch, SetStateAction, useState } from "react"
import { Button, DialogContentText, Typography } from "@material-ui/core"
import { Dialog, DialogContent, DialogActions } from "@material-ui/core"
import axios from "axios"
import { toast } from "react-toastify"
import Div from "../Div"
import { mutate } from "swr"

interface Props {
  deleteId: { pid: number; name: string }
  setOpen: Dispatch<SetStateAction<{ pid: number; name: string }>>
}

const DeleteBasketDialog: React.FC<Props> = ({ deleteId, setOpen }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteBasket = async () => {
    if (isDeleting) return
    setIsDeleting(true)

    try {
      await axios.delete(`/api/basket/${deleteId?.pid}/${deleteId?.name}`)
      toast.success("Basket deleted!")
      mutate("portfolio")
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
        <Typography variant="h5">Delete {deleteId?.name}?</Typography>
      </Div>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this Basket? This will delete all
          transactions created under it.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(undefined)}>Cancel</Button>
        <Button onClick={handleDeleteBasket} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default React.memo(DeleteBasketDialog)
