import { useState } from "react"
import { useRouter } from "next/router"
import { Typography, TextField, Button, Grid } from "@material-ui/core"
import { CreateAccountDialog, Div } from "components"
import axios from "axios"
import { toast } from "react-toastify"

const LoginPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [openCreateAccount, setOpenCreateAccount] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleLogin = async () => {
    if (isLoggingIn) return
    setIsLoggingIn(true)
    try {
      await axios.post("/api/auth/login", {
        email,
        password,
      })
      router.push("/dashboard")
    } catch (err) {
      toast.error(err?.response?.data?.message || "Unknown error occured")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const setTestEmail = () => {
    setEmail("markzuckerberg@facebook.com")
    setPassword("password")
  }

  return (
    <Div minHeight="100vh">
      <Div fill justifyContentCenter>
        <Div center>
          <Grid container>
            <Grid item xs>
              <Div row center>
                <Div maxWidth={408}>
                  <Typography variant="h3" style={{ color: "#42B3E6" }}>
                    StockHouse
                  </Typography>
                  <Typography variant="h6">
                    Stocks, Crypto, Forex, Metals, Real Estate, Anything. All
                    here. The portfolio manager that makes your life organzied
                    and simpler.
                  </Typography>
                </Div>
              </Div>
            </Grid>
            <Grid item xs>
              <Div row center>
                <Div
                  borderRadius={4}
                  mh={8}
                  minWidth={392}
                  maxWidth={392}
                  p={24}
                  style={{ boxShadow: `0 4px 16px 0 rgba(0, 0, 0, 0.3)` }}
                >
                  <TextField
                    autoComplete="email"
                    label="Email"
                    onChange={e => setEmail(e.target.value)}
                    type="email"
                    value={email}
                    variant="outlined"
                  />
                  <Div h={16} />
                  <TextField
                    autoComplete="current-password"
                    label="Password"
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    value={password}
                    variant="outlined"
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                  />
                  <Div h={16} />
                  <Button
                    disableRipple
                    onClick={handleLogin}
                    size="large"
                    variant="contained"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? "Logging In..." : "Login"}
                  </Button>
                  <Div mv={24} h={1} backgroundColor="#dadde1" />
                  <Div row alignSelfCenter>
                    <Button
                      color="secondary"
                      disableRipple
                      onClick={() => setOpenCreateAccount(true)}
                      size="large"
                      variant="contained"
                    >
                      Create Account
                    </Button>
                    <Div alignSelfCenter mh={4}>
                      <Typography>OR</Typography>
                    </Div>
                    <Button
                      color="secondary"
                      disableRipple
                      onClick={() => setTestEmail()}
                      size="large"
                      variant="contained"
                    >
                      Use Test Acc
                    </Button>
                  </Div>
                </Div>
              </Div>
            </Grid>
          </Grid>
        </Div>
      </Div>
      <CreateAccountDialog
        openCreateAccount={openCreateAccount}
        setOpenCreateAccount={setOpenCreateAccount}
      />
      <Div mb={16} center>
        <code>
          Made with love for CPSC 304 by Liang Liu, Kavpreet Grewal, and Anson
          Chen
        </code>
      </Div>
    </Div>
  )
}

export default LoginPage
