import React, { Dispatch, SetStateAction, useState } from "react"
import { Button, DialogContentText, Typography } from "@material-ui/core"
import { Dialog, DialogContent, DialogActions } from "@material-ui/core"
import axios from "axios"
import { toast } from "react-toastify"
import Div from "../Div"

interface Props {
  deleteId: { id: number; accounttype: string }
  refetchUser: () => void
  setOpen: Dispatch<SetStateAction<{ id: number; accounttype: string }>>
}

const DeleteAccountDialog: React.FC<Props> = ({
  deleteId,
  refetchUser,
  setOpen,
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteAccount = async () => {
    if (isDeleting) return
    setIsDeleting(true)

    try {
      await axios.delete(`/api/account/${deleteId?.id}`)
      refetchUser()
      toast.success("Account deleted!")
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
        <Typography variant="h5">Delete {deleteId?.accounttype}?</Typography>
      </Div>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this Account?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(undefined)}>Cancel</Button>
        <Button onClick={handleDeleteAccount} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default React.memo(DeleteAccountDialog)
