import { Typography, Button, IconButton } from "@material-ui/core"
import React, { FunctionComponent } from "react"
import Link from "next/link"
import Paper from "@material-ui/core/Paper"
import Box from "@material-ui/core/Box"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"

interface Props {
  title: string
  description: string
  actionLink: string
  actionText: string
  handleEdit?: () => void
  handleOpenDelete?: () => void
}

const ItemCard: FunctionComponent<Props> = ({
  title,
  description,
  actionLink,
  actionText,
  handleEdit,
  handleOpenDelete,
}) => {
  return (
    <Paper sx={{ p: 1.5 }} elevation={6}>
      <Box sx={{ minHeight: "200px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            {title}
          </Typography>
          <span>
            {handleEdit && (
              <IconButton onClick={handleEdit} size="small">
                <EditIcon />
              </IconButton>
            )}
            {handleOpenDelete && (
              <IconButton onClick={handleOpenDelete} size="small">
                <DeleteIcon />
              </IconButton>
            )}
          </span>
        </Box>
        <Typography variant="body1">{description}</Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Link href={actionLink} passHref>
          <Button size="small">{actionText}</Button>
        </Link>
      </Box>
    </Paper>
  )
}

export default ItemCard
