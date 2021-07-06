import Box from "@material-ui/core/Box"
import CircularProgress from "@material-ui/core/CircularProgress"
import { FunctionComponent } from "react"

const LoadingBox: FunctionComponent = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </Box>
  )
}
export default LoadingBox
