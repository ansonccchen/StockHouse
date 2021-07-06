import React, { ReactNode } from "react"
import { Typography, IconButton } from "@material-ui/core"
import { Dialog, DialogContent } from "@material-ui/core"
import Div from "./Div"
import CloseIcon from "@material-ui/icons/Close"

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children?: ReactNode
  onFormSubmit: () => void
}

const CustomDialog: React.FC<Props> = ({
  open,
  onClose,
  title,
  children,
  onFormSubmit,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <Div w={432}>
        <Div alignItemsCenter row justifyContentBetween ml={24} mr={8} mt={8}>
          <Typography variant="h5">{title}</Typography>
          <IconButton disableRipple onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Div>
        <DialogContent dividers>
          <form
            onSubmit={e => {
              e.preventDefault()
              onFormSubmit()
            }}
            style={{ display: "flex", flexDirection: "column" }}
          >
            {children}
          </form>
        </DialogContent>
      </Div>
    </Dialog>
  )
}

export default React.memo(CustomDialog)
