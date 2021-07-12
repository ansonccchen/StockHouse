import React, { ReactNode, useState } from "react"
import Link from "next/link"
import Head from "next/head"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import CssBaseline from "@material-ui/core/CssBaseline"
import Box from "@material-ui/core/Box"
import axios from "axios"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import { useEffect } from "react"

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = "StockHouse" }: Props) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, status } = await axios.get("/api/user")

        if (status === 401) {
          setIsLoggedIn(false)
        } else {
          setIsLoggedIn(true)
        }
      } catch {
        setIsLoggedIn(false)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [])

  return (
    <div style={{ minHeight: "100vh" }}>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Link href="/dashboard" passHref>
            <Button style={{ textTransform: "none" }} disableRipple>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, color: "white" }}
              >
                StockHouse
              </Typography>
            </Button>
          </Link>
          <div style={{ flex: 1 }} />
          <Link href="/commodities" passHref>
            <Button color="inherit">Commodities</Button>
          </Link>
          {!isLoading &&
            (isLoggedIn ? (
              <>
                <Link href="/dashboard" passHref>
                  <Button color="inherit">Dashboard</Button>
                </Link>
                <Button
                  color="inherit"
                  onClick={async () => {
                    try {
                      await axios.post("/api/auth/logout")
                      router.push("/login")
                    } catch (err) {
                      toast.error(
                        err?.response?.data?.message || "Unknown error occured"
                      )
                    }
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login" passHref>
                <Button color="inherit">Login</Button>
              </Link>
            ))}
        </Toolbar>
      </AppBar>
      <Box sx={{ py: 2 }}>{children}</Box>
      <Box sx={{ textAlign: "center", width: "100%" }}>
        <code>
          Made with love by Liang Liu, Kavpreet Grewal, and Anson Chen
        </code>
      </Box>
    </div>
  )
}

export default Layout
