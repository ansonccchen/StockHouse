import React, { useState, useEffect } from "react"
import { Typography, Tooltip, IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { Div } from "components"
import AutorenewIcon from "@material-ui/icons/Autorenew"
import axios from "axios"
import FavoriteIcon from "@material-ui/icons/Favorite"
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder"
import { toast } from "react-toastify"
import useSWR, { mutate } from "swr"

interface Props {
  cid: number
  name: string
  prettyname: string
  value: number
  defaultFav?: boolean
}

const CommodityItem: React.FC<Props> = ({
  cid,
  name,
  prettyname,
  value,
  defaultFav = false,
}) => {
  const classes = useStyles()
  const [spin, setSpin] = useState(false)
  const [price, setPrice] = useState(value)
  const [isClicked, setIsClicked] = useState(false)
  const [isWatched, setIsWatched] = useState(defaultFav)

  const refresh = async () => {
    setSpin(true)
    const res = await axios.get(`/api/commodity/${cid}`)
    setPrice(res.data)
    setSpin(false)
  }

  const handleWatch = async () => {
    if (isClicked) return
    setIsClicked(true)

    try {
      if (isWatched) {
        await axios.delete(`/api/commodity/${cid}`)
        setIsWatched(false)
      } else {
        await axios.post(`/api/commodity/${cid}`)
        setIsWatched(true)
      }
      await fetchIsWatched()
      mutate("watchedCommodities")
      mutate("/api/user")
    } catch (err) {
      if (isWatched) {
        toast.error("Failed to unwatch / unfavourite a commodity")
      } else {
        toast.error("Failed to watch / favourite a commodity")
      }
    } finally {
      setIsClicked(false)
    }
  }

  const fetchIsWatched = async () => {
    try {
      const { data } = await axios.get(`/api/commodity/watched/${cid}`)
      setIsWatched(data)
    } catch (err) {
      toast.error(`Failed to fetch if ${prettyname} is watched / favourited`)
    }
  }

  useEffect(() => {
    fetchIsWatched()
  }, [])

  return (
    <Div row mv={8} justifyContentBetween>
      <Div>
        <Typography variant="h6" style={{ fontWeight: 600 }}>
          {name}
          {" - "}
          {prettyname}
        </Typography>
        <Typography>
          Last Updated Price: ${Number(price)?.toFixed(2)}
        </Typography>
      </Div>
      <Div row alignItemsCenter>
        <Tooltip
          title={isWatched ? "Unwatch / Unfavourite" : "Watch / Favourite"}
        >
          <IconButton disableRipple onClick={handleWatch}>
            {isWatched ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Update to latest price">
          <IconButton disableRipple onClick={refresh}>
            <AutorenewIcon className={spin ? classes.spin : classes.refresh} />
          </IconButton>
        </Tooltip>
      </Div>
    </Div>
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

export default React.memo(CommodityItem)
