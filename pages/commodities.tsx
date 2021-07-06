import React, { useState } from "react"
import { Container, Typography, Button, Tooltip, Grid } from "@material-ui/core"
import { IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { Div, Layout, CardContainer, AddCommodityDialog } from "components"
import { CommodityItem } from "components"
import CheckBoxIcon from "@material-ui/icons/CheckBox"
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank"
import AutorenewIcon from "@material-ui/icons/Autorenew"
import { GetServerSideProps } from "next"
import { verifyUser } from "utils/auth"
import { getCommoditySummaries } from "./api/commodity"
import { Commodity, CommoditySummary } from "interfaces"
import axios from "axios"
import { toast } from "react-toastify"
import TextField from "@material-ui/core/TextField"
import { formatCurrency } from "utils/formatters"
import MenuItem from "@material-ui/core/MenuItem"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import Select from "@material-ui/core/Select"
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

  const [popularCommodities, setPopularCommodities] =
    useState<Commodity[] | null>(null)
  const [minPrice, setMinPrice] = useState(50)
  const [queries, setQueries] = useState<string>("transacted and watched")
  const [isFetchingPopularCommodities, setIsFetchingPopularCommodities] =
    useState(false)
  const [isFetchingCommodities, setIsFetchingCommodities] = useState(false)

  const handleGetPopularCommodities = async () => {
    try {
      setIsFetchingPopularCommodities(true)
      const { data } = await axios.get(`/api/commodity/popular`, {
        params: {
          price: minPrice,
          queries,
        },
      })
      setPopularCommodities(data)
    } catch (err) {
      toast.error(err?.response?.data?.message || "Unknown error occured")
    } finally {
      setIsFetchingPopularCommodities(false)
    }
  }

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
      <Layout title="Error | Portfolio Tracker">
        <p>
          <span style={{ color: "red" }}>Error:</span> {errors}
        </p>
      </Layout>
    )
  }

  return (
    <Layout title="Home | Portfolio Tracker">
      <Container maxWidth={false}>
        <Grid container spacing={5}>
          <Grid item xs={8}>
            <Div row fill mb={32}>
              <FilterButton
                onClick={() =>
                  setFilters({ ...filters, stocks: !filters.stocks })
                }
                filterType={filters.stocks}
                label="Stocks"
              />
              <Div w={16} />
              <FilterButton
                onClick={() =>
                  setFilters({ ...filters, crypto: !filters.crypto })
                }
                filterType={filters.crypto}
                label="Crypto"
              />
              <Div w={16} />
              <FilterButton
                onClick={() =>
                  setFilters({ ...filters, forex: !filters.forex })
                }
                filterType={filters.forex}
                label="Forex"
              />
              <Div w={16} />
              <FilterButton
                onClick={() =>
                  setFilters({ ...filters, other: !filters.other })
                }
                filterType={filters.other}
                label="Other"
              />
              <Div w={16} />
              <Button
                disableRipple
                onClick={handleApplyFilter}
                style={{ ...styles.button, color: "white" }}
                variant="contained"
              >
                {isFetchingCommodities ? "Fetching..." : "Apply Filter"}
              </Button>
            </Div>
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
              {commoditySummaries.map(commodity => {
                return (
                  <React.Fragment key={commodity.cid}>
                    <CommodityItem
                      cid={commodity?.cid}
                      name={commodity?.name}
                      prettyname={commodity?.prettyname}
                      value={commodity?.value}
                    />
                    <Div mv={24} h={1} backgroundColor="#dadde1" />
                  </React.Fragment>
                )
              })}
            </CardContainer>
          </Grid>
          <Grid item xs={4}>
            <CardContainer>
              <Typography variant="h4">Popular Commodities</Typography>
              <Typography variant="body1">
                Click to get commodities over a certain minimum price that have
                been watched or transacted or both at least once (you select) by
                every user
              </Typography>
              <TextField
                sx={{ my: 1 }}
                label="Min price"
                onChange={e => setMinPrice(Number(e.target.value))}
                type="number"
                value={minPrice}
                variant="outlined"
              />
              <FormControl
                variant="outlined"
                sx={{ minWidth: "200px", my: 1, ml: 1 }}
              >
                <InputLabel>Divide by</InputLabel>
                <Select
                  value={queries}
                  onChange={e => setQueries(e.target.value)}
                  label="Divide by"
                  required
                >
                  {[
                    "Watched Commodities",
                    "Transacted Commodities",
                    "Watched & Transacted Commodities",
                  ].map((type, index) => {
                    return (
                      <MenuItem key={index} value={type.toLowerCase()}>
                        {type}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
              <br />
              <Button
                sx={{ my: 1 }}
                onClick={handleGetPopularCommodities}
                variant="contained"
              >
                {isFetchingPopularCommodities
                  ? "Fetching..."
                  : "Get Popular Commodities"}
              </Button>
              {popularCommodities &&
                (popularCommodities.length ? (
                  popularCommodities.map(commodity => (
                    <Typography key={commodity.cid} variant="body1">
                      {commodity.description} {formatCurrency(commodity.price)}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body1">
                    No popular commodities
                  </Typography>
                ))}
            </CardContainer>
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

const FilterButton = ({ onClick, filterType, label }) => {
  return (
    <Button
      disableRipple
      onClick={onClick}
      startIcon={
        filterType ? (
          <CheckBoxIcon color="primary" />
        ) : (
          <CheckBoxOutlineBlankIcon color="primary" />
        )
      }
      style={styles.button}
      variant="outlined"
    >
      {label}
    </Button>
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

const styles = {
  button: {
    borderRadius: 24,
    color: "black",
    fontSize: 14,
  },
}

export default CommoditiesPage

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
