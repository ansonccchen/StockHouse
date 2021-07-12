import Link from "next/link"
import { Layout } from "components"
import React from "react"
import { Container } from "@material-ui/core"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"

const IndexPage = () => (
  <Layout title="Home | StockHouse">
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography variant="h2" sx={{ mt: 3 }}>
            StockHouse
          </Typography>
          <Typography variant="h6">
            View all your trades in one place and perform nice queries with
            them!
          </Typography>
          <Link href="/dashboard" passHref>
            <Button sx={{ mt: 2 }} variant="contained">
              Get started!
            </Button>
          </Link>
        </Grid>
        <Grid item xs={4}>
          <img
            style={{ maxWidth: "100%" }}
            src="/undraw_personal_finance_tqcd.svg"
          />
        </Grid>
      </Grid>
    </Container>
  </Layout>
)

export default IndexPage
