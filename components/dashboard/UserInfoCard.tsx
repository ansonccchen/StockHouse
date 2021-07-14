import React from "react"
import { Box, Typography, Grid, IconButton } from "@material-ui/core"
import { CardContainer } from "components"
import { formatAddress, formatPhone } from "utils/formatters"
import AddIcon from "@material-ui/icons/Add"
import DeleteIcon from "@material-ui/icons/Delete"

interface Props {
  address: {
    unitnumber: number
    housenumber: number
    streetname: string
    province: string
    postalcode: string
  }
  accounts: [any?]
  email: string
  id: number
  phone: string
  setDeleteAccountId: React.Dispatch<any>
  setOpenAddAccount: React.Dispatch<React.SetStateAction<boolean>>
}

const UserInfoCard: React.FC<Props> = ({
  accounts,
  address,
  email,
  id,
  phone,
  setDeleteAccountId,
  setOpenAddAccount,
}) => {
  return (
    <CardContainer>
      <Typography variant="h4" gutterBottom>
        Information
      </Typography>
      <div>Email: {email}</div>
      <div>Address: {formatAddress(address)}</div>
      <div>Phone: {formatPhone(phone)}</div>

      {/* Account Section */}
      <Box
        sx={{
          mt: 5,
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Accounts
        </Typography>
        <IconButton onClick={() => setOpenAddAccount(true)}>
          <AddIcon />
        </IconButton>
      </Box>
      <Grid container direction="column" spacing={2}>
        {accounts.map(account => {
          return (
            <Grid key={id} item xs>
              <Typography
                variant="h6"
                style={{
                  fontWeight: 600,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {account.accounttype}
                <IconButton
                  onClick={() => {
                    setDeleteAccountId({
                      id,
                      accounttype: account.accounttype,
                    })
                  }}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Typography>
              {account?.tradingplatforms?.map(platform => {
                return (
                  <Typography>
                    {platform.name}{" "}
                    <a href={"//" + platform.link} target="_blank">
                      ({platform.link})
                    </a>
                  </Typography>
                )
              })}
            </Grid>
          )
        })}
      </Grid>
    </CardContainer>
  )
}

export default UserInfoCard
