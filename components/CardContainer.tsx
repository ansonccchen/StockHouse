import Paper from "@material-ui/core/Paper"
import React, { FunctionComponent } from "react"

interface Props {
  minHeight?: number
}

const CardContainer: FunctionComponent<Props> = ({ children, minHeight = 0 }) => {
  return <Paper sx={{ mb: 3, p: 3, position: "relative", minHeight }}>{children}</Paper>
}
export default CardContainer
