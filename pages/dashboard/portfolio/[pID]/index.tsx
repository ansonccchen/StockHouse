import { GetServerSideProps } from "next"
import React, { useState } from "react"
import { Container, Grid, Typography, IconButton } from "@material-ui/core"
import { CardContainer, ItemCard, Layout, AddBasketDialog } from "components"
import { DeleteBasketDialog, LoadingBox } from "components"
import { formatCurrency } from "utils/formatters"
import { green, red } from "@material-ui/core/colors"
import AddIcon from "@material-ui/icons/Add"
import axios from "axios"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import useSWR from "swr"
import { Portfolio } from "interfaces"

type Props = {
  portfolioId?: number
}

const PortfolioPage = ({ portfolioId }: Props) => {
  const [openAddBasket, setOpenAddBasket] = useState(false)
  const [deleteBasketId, setDeleteBasketId] = useState(undefined)

  const router = useRouter()

  const fetchPortfolio = async () => {
    try {
      const { data } = await axios.get(`/api/portfolio/${portfolioId}`)
      return data as Portfolio
    } catch (err) {
      if (err?.response?.status === 401) {
        router.push("/login")
      } else {
        toast.error("failed to fetch portfolio")
      }
    }
  }

  const { data: portfolio } = useSWR("portfolio", fetchPortfolio)

  if (!portfolio) return <LoadingBox />

  return (
    <Layout title={`${portfolio ? portfolio.title : "Portfolio"} | StockHouse`}>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <CardContainer minHeight={200}>
              <Typography variant="h4" gutterBottom>
                Your Baskets
              </Typography>
              <IconButton
                sx={{ position: "absolute", top: 20, right: 15 }}
                onClick={() => setOpenAddBasket(true)}
              >
                <AddIcon />
              </IconButton>
              <Grid container spacing={4}>
                {portfolio.baskets.map(basket => (
                  <Grid key={basket.name} item xs={4}>
                    <ItemCard
                      title={basket.name}
                      description={basket.description}
                      actionText="View Basket"
                      actionLink={`/dashboard/portfolio/${portfolio.pid}/basket/${basket.name}`}
                      handleOpenDelete={() => {
                        setDeleteBasketId({
                          name: basket.name,
                          pid: portfolio.pid,
                        })
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContainer>
          </Grid>
          <Grid item xs={12} md={4}>
            <CardContainer>
              <Typography variant="h4" gutterBottom>
                {portfolio.title}
              </Typography>
              <Typography variant="body1">{portfolio.description}</Typography>
              <Typography variant="h5" display="inline">
                {`Total: ${formatCurrency(portfolio.currentbalance ?? 0)} `}
              </Typography>
              <Typography
                variant="h6"
                display="inline"
                sx={{
                  color:
                    portfolio.currentbalance - portfolio.initialbalance >= 0
                      ? green[500]
                      : red[500],
                }}
              >
                Change:{" "}
                {formatCurrency(
                  portfolio.currentbalance - portfolio.initialbalance || 0
                )}
              </Typography>
            </CardContainer>
          </Grid>
        </Grid>
      </Container>
      <DeleteBasketDialog
        setOpen={setDeleteBasketId}
        deleteId={deleteBasketId}
      />
      <AddBasketDialog
        openAddBasket={openAddBasket}
        setOpenAddBasket={setOpenAddBasket}
      />
    </Layout>
  )
}

export default PortfolioPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return { props: { portfolioId: params.pID } }
}
