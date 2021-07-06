import React, { useState } from "react"
import { GetServerSideProps } from "next"
import { CardContainer, Layout, LoadingBox } from "components"
import { AddTransactionDialog, StatsViewV2 } from "components"
import { SelectedColumnTable, AllTransactionsTable } from "components"
import { PopularTransactedCommoditiesTable, Div } from "components"
import { DeleteTransactionDialog } from "components"
import { Container, Grid, IconButton, colors } from "@material-ui/core"
import { Typography, Tabs, Tab } from "@material-ui/core"
import { formatCurrency } from "utils/formatters"
import AddIcon from "@material-ui/icons/Add"
import useSWR from "swr"
import axios from "axios"
import { toast } from "react-toastify"
import { useRouter } from "next/router"

type Props = {
  basketName: string
  portfolioId: string
}

const BasketPage = ({ basketName, portfolioId }: Props) => {
  const router = useRouter()
  const [isAddTransactionDialogOpen, setIsAddTransactionDialogOpen] =
    useState(false)
  const [tableView, setTableView] = useState(0)
  const [deleteTransactionId, setDeleteTransactionId] = useState(undefined)

  const fetchBasket = async () => {
    try {
      const { data } = await axios.get(
        `/api/basket/${portfolioId}/${basketName}`
      )
      return data
    } catch (err) {
      if (err?.response?.status === 401) {
        router.push("/login")
      } else {
        toast.error("failed to fetch basket")
      }
    }
  }

  const { data: basket } = useSWR("basket", fetchBasket)

  if (!basket) return <LoadingBox />

  return (
    <Layout title={`${basket ? basket.name : "Basket"} | Portfolio Tracker`}>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <CardContainer>
              <Typography variant="h4" gutterBottom>
                Transactions
              </Typography>
              <IconButton
                sx={{ position: "absolute", top: 20, right: 15 }}
                onClick={() => setIsAddTransactionDialogOpen(true)}
              >
                <AddIcon />
              </IconButton>
              <Tabs
                value={tableView}
                onChange={(event: React.ChangeEvent<{}>, newValue: number) =>
                  setTableView(newValue)
                }
              >
                <Tab label="All" disableRipple />
                <Tab label="Aggregated Commodity Stats" disableRipple />
                <Tab label="Select Column View" disableRipple />
              </Tabs>
              <Div h={16} />
              {tableView === 0 && (
                <AllTransactionsTable
                  transactions={basket.transactions}
                  setDeleteTransactionId={setDeleteTransactionId}
                />
              )}
              {tableView === 1 && (
                <PopularTransactedCommoditiesTable
                  pid={router.query?.pID}
                  basketname={router.query?.name}
                />
              )}
              {tableView === 2 && (
                <SelectedColumnTable
                  pid={router.query?.pID}
                  basketname={router.query?.name}
                />
              )}
            </CardContainer>
          </Grid>
          <Grid item xs={12} md={4}>
            <CardContainer>
              <Typography variant="h4" gutterBottom>
                {basket.name}
              </Typography>
              <Typography variant="body1">{basket.description}</Typography>
              <Typography variant="h5" display="inline">
                {`Total: ${formatCurrency(basket.currentbalance)} `}
              </Typography>
              <Typography
                variant="h6"
                display="inline"
                sx={{
                  color:
                    basket.currentbalance - basket.initialbalance >= 0
                      ? colors.green[500]
                      : colors.red[500],
                }}
              >
                Change:{" "}
                {formatCurrency(basket.currentbalance - basket.initialbalance)}
              </Typography>
            </CardContainer>
            <CardContainer>
              <StatsViewV2
                pid={router.query?.pID}
                basketname={router.query?.name}
              />
            </CardContainer>
          </Grid>
        </Grid>
      </Container>
      <DeleteTransactionDialog
        deleteId={deleteTransactionId}
        setOpen={setDeleteTransactionId}
      />
      <AddTransactionDialog
        basketName={basket.name}
        portfolioId={basket.portfolioid as number}
        isOpen={isAddTransactionDialogOpen}
        setIsOpen={setIsAddTransactionDialogOpen}
      />
    </Layout>
  )
}

export default BasketPage

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  return { props: { basketName: params.name, portfolioId: params.pID } }
}
