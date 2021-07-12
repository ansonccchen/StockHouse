import React, { useState } from "react"
import { Typography, Button, TextField } from "@material-ui/core"
import { MenuItem, FormControl, InputLabel, Select } from "@material-ui/core"
import { CardContainer } from "components"
import { Commodity } from "interfaces"
import axios from "axios"
import { toast } from "react-toastify"
import { formatCurrency } from "utils/formatters"

interface Props {}

const PopularCommodities: React.FC<Props> = () => {
  const [queries, setQueries] = useState<string>("transacted and watched")

  const [minPrice, setMinPrice] = useState(50)
  const [popularCommodities, setPopularCommodities] = useState<
    Commodity[] | null
  >(null)

  const [isFetchingPopularCommodities, setIsFetchingPopularCommodities] =
    useState(false)

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

  return (
    <CardContainer>
      <Typography variant="h4">Popular Commodities</Typography>
      <Typography variant="body1">
        Click to get commodities over a certain minimum price that have been
        watched or transacted or both at least once by every user
      </Typography>
      <TextField
        sx={{ my: 1 }}
        label="Min price"
        onChange={e => setMinPrice(Number(e.target.value))}
        type="number"
        value={minPrice}
        variant="outlined"
      />
      <FormControl variant="outlined" sx={{ minWidth: "200px", my: 1, ml: 1 }}>
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
        disableRipple
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
          <Typography variant="body1">No popular commodities</Typography>
        ))}
    </CardContainer>
  )
}

export default React.memo(PopularCommodities)
