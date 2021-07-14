import React, { useState } from "react"
import { Container, Typography, Button, Tooltip, Grid } from "@material-ui/core"
import { IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { Div, Layout, CardContainer, AddCommodityDialog } from "components"
import { CommodityItem, Filters, PopularCommodities } from "components"
import AutorenewIcon from "@material-ui/icons/Autorenew"
import { GetServerSideProps } from "next"
import { verifyUser } from "utils/auth"
import { getCommoditySummaries } from "./api/commodity"
import { CommoditySummary } from "interfaces"
import axios from "axios"
import { toast } from "react-toastify"
import { formatCurrency } from "utils/formatters"
import useSWR from "swr"

interface Props {
  commoditySummaries?: CommoditySummary[]
  errors?: string
}
// TODO: Fix the way commodities are updated in the ui after adding a new one
const CommoditiesPage = ({
  commoditySummaries: initialCommoditySummaries,
  errors,
}: Props) => {
  const classes = useStyles()
  const [filters, setFilters] = useState({
    crypto: true,
    forex: true,
    other: true,
    stocks: true,
  })

  const [openAddCommodity, setOpenAddCommodity] = useState(false)
  const [commoditySummaries, setCommoditySummaries] = useState(
    initialCommoditySummaries || []
  )
  const [spin, setSpin] = useState(false)

  const [isFetchingCommodities, setIsFetchingCommodities] = useState(false)

  const handleApplyFilter = async () => {
    try {
      setIsFetchingCommodities(true)
      const { data } = await axios.get(`/api/commodity/filter`, {
        params: {
          commodities: Object.entries(filters)
            .filter(([commodity, isSet]) => isSet)
            .map(([commodity, _]) => commodity),
        },
      })
      setCommoditySummaries(data)
    } catch (err) {
      toast.error(err?.response?.data?.message || "Unknown error occured")
    } finally {
      setIsFetchingCommodities(false)
    }
  }

  const refreshAllCommodities = async () => {
    setSpin(true)
    try {
      await axios.get("/api/commodity/updateAll")
      handleApplyFilter()
    } catch (err) {
      toast.error(err?.response?.data?.message || "Unknown error occured")
    } finally {
      setSpin(false)
    }
  }

  // const fetchWatchedCommodities = async () => {
  //   try {
  //   } catch {}
  // }

  // const { data: watchedcommodities } = useSWR(
  //   "watchedCommodities",
  //   fetchWatchedCommodities
  // )

  // const fetchCommodites = async () => {
  //   try {
  //   } catch {}
  // }

  if (errors) {
    return (
      <Layout title="Error | StockHouse">
        <p>
          <span style={{ color: "red" }}>Error:</span> {errors}
        </p>
      </Layout>
    )
  }

  return (
    <Layout title="Home | StockHouse">
      <Container maxWidth={false}>
        <Grid container spacing={5}>
          <Grid item xs={8}>
            <Filters
              filters={filters}
              handleApplyFilter={handleApplyFilter}
              isFetchingCommodities={isFetchingCommodities}
              setFilters={setFilters}
            />
            <Div row alignItemsCenter justifyContentBetween>
              <Typography variant="h2">Commodities</Typography>
              <Div row>
                <Tooltip title="Update all quotes to latest price">
                  <IconButton disableRipple onClick={refreshAllCommodities}>
                    <AutorenewIcon
                      className={spin ? classes.spin : classes.refresh}
                    />
                  </IconButton>
                </Tooltip>
                <Div w={8} />
                <Button
                  disableRipple
                  onClick={() => setOpenAddCommodity(true)}
                  variant="outlined"
                >
                  Add New
                </Button>
              </Div>
            </Div>
            <CardContainer>
              {commoditySummaries
                .sort((a, b) => {
                  if (a.prettyname > b.prettyname) return 1
                  if (a.prettyname < b.prettyname) return -1
                  return 0
                })
                .map(commodity => {
                  return (
                    <React.Fragment key={commodity.cid}>
                      <CommodityItem
                        cid={commodity?.cid}
                        name={commodity?.name}
                        prettyname={commodity?.prettyname}
                        value={commodity?.value}
                        defaultFav
                      />
                      <Div mv={24} h={1} backgroundColor="#dadde1" />
                    </React.Fragment>
                  )
                })}
            </CardContainer>
          </Grid>
          <Grid item xs={4}>
            <PopularCommodities />
          </Grid>
        </Grid>
      </Container>
      <AddCommodityDialog
        openAddCommodity={openAddCommodity}
        setOpenAddCommodity={setOpenAddCommodity}
        handleApplyFilter={handleApplyFilter}
      />
    </Layout>
  )
}

const useStyles = makeStyles(() => ({
  refresh: {
    margin: "auto",
  },
  spin: {
    margin: "auto",
    animation: "$spin 1s 1",
  },
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}))

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  try {
    const email = await verifyUser(req.cookies.user)

    if (email.length === 0) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      }
    } else {
      const commoditySummaries = await getCommoditySummaries()
      return { props: { commoditySummaries } }
    }
  } catch (err) {
    return { props: { errors: err.message } }
  }
}

export default CommoditiesPage
