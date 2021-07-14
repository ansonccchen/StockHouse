import React, { FunctionComponent, useState } from "react"
import { Container, Typography, Grid, IconButton } from "@material-ui/core"
import { colors } from "@material-ui/core"
import { CardContainer, Layout, ItemCard, LoadingBox } from "components"
import { AddAccountDialog, PortfolioDialog, CommodityItem } from "components"
import { DeletePortfolioDialog, DeleteAccountDialog } from "components"
import { UserInfoCard } from "components"
import { formatCurrency } from "utils/formatters"
import axios from "axios"
import { Portfolio } from "interfaces"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import useSWR, { mutate } from "swr"
import AddIcon from "@material-ui/icons/Add"

const DashboardPage: FunctionComponent = () => {
  const router = useRouter()

  const [openAddAccount, setOpenAddAccount] = useState(false)
  const [deleteId, setDeleteId] = useState(undefined)
  const [deleteAccountId, setDeleteAccountId] = useState(undefined)

  const [isAddPortfolioDialogOpen, setIsAddPortfolioDialogOpen] =
    useState(false)
  const [portfolioActionType, setPortfolioActionType] = useState<
    "edit" | "create"
  >("create")
  const [editedPortfolio, setEditedPortfolio] = useState<undefined | Portfolio>(
    undefined
  )

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user")
      return data
    } catch (err) {
      if (err?.response?.status === 401) {
        router.push("/login")
      } else {
        toast.error("failed to fetch user")
      }
    }
  }

  const refetchUser = () => {
    // probably cuz something changed
    mutate("/api/user")
  }
  const { data: user } = useSWR("/api/user", fetchUser)

  if (!user) return <LoadingBox />

  return (
    <Layout title="Dashboard">
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <CardContainer>
              <Typography variant="h3">
                Welcome back {user.firstname} {user.lastname}
              </Typography>
              <Typography variant="h6">Summary</Typography>
              <Typography variant="h4" display="inline">
                {`Total: ${formatCurrency(user.currentbalance)} `}
              </Typography>
              <Typography
                variant="h6"
                display="inline"
                sx={{
                  color:
                    user.currentbalance - user.initialbalance >= 0
                      ? colors.green[500]
                      : colors.red[500],
                }}
              >
                Change:{" "}
                {formatCurrency(user.currentbalance - user.initialbalance)}
              </Typography>
            </CardContainer>
            <CardContainer>
              <Typography variant="h4" gutterBottom>
                Portfolios
              </Typography>
              <IconButton
                sx={{ position: "absolute", top: 20, right: 15 }}
                onClick={() => {
                  setIsAddPortfolioDialogOpen(true)
                  setEditedPortfolio(undefined)
                  setPortfolioActionType("create")
                }}
              >
                <AddIcon />
              </IconButton>
              <Grid container spacing={4}>
                {user.portfolios.map(portfolio => (
                  <Grid key={portfolio.pid} item xs={4}>
                    <ItemCard
                      title={portfolio.title}
                      description={portfolio.description}
                      actionText="View Portfolio"
                      actionLink={`/dashboard/portfolio/${portfolio.pid}`}
                      handleEdit={() => {
                        setEditedPortfolio(portfolio)
                        setIsAddPortfolioDialogOpen(true)
                        setPortfolioActionType("edit")
                      }}
                      handleOpenDelete={() => {
                        setDeleteId({
                          pid: portfolio.pid,
                          title: portfolio.title,
                        })
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContainer>
          </Grid>
          <Grid item xs={12} md={4}>
            <UserInfoCard
              email={user.email}
              address={user.address}
              phone={user.phone}
              accounts={user.accounts}
              id={user.id}
              setOpenAddAccount={setOpenAddAccount}
              setDeleteAccountId={setDeleteAccountId}
            />
            <CardContainer>
              <Typography variant="h4">Favourite Commodities</Typography>
              <Grid container direction="column" spacing={2}>
                {user?.watchedcommodities?.map((commodity, index) => {
                  return (
                    <Grid key={String(index)} item xs>
                      <CommodityItem
                        name={commodity.name}
                        prettyname={commodity.prettyname}
                        value={commodity.value}
                        cid={commodity.cid}
                      />
                    </Grid>
                  )
                })}
              </Grid>
            </CardContainer>
          </Grid>
        </Grid>
      </Container>
      <DeletePortfolioDialog
        deleteId={deleteId}
        refetchUser={refetchUser}
        setOpen={setDeleteId}
      />
      <AddAccountDialog
        openAddAccount={openAddAccount}
        setOpenAddAccount={setOpenAddAccount}
        refetchUser={refetchUser}
      />
      <DeleteAccountDialog
        deleteId={deleteAccountId}
        refetchUser={refetchUser}
        setOpen={setDeleteAccountId}
      />
      <PortfolioDialog
        actionType={portfolioActionType}
        editedPortfolio={editedPortfolio}
        isOpen={isAddPortfolioDialogOpen}
        refetchUser={refetchUser}
        setIsOpen={setIsAddPortfolioDialogOpen}
      />
    </Layout>
  )
}

export default DashboardPage
