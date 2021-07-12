import React from "react"
import { Button } from "@material-ui/core"
import { Div } from "components"
import CheckBoxIcon from "@material-ui/icons/CheckBox"
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank"

interface Props {
  filters: { crypto: boolean; forex: boolean; other: boolean; stocks: boolean }
  handleApplyFilter: () => Promise<void>
  isFetchingCommodities: boolean
  setFilters: React.Dispatch<
    React.SetStateAction<{
      crypto: boolean
      forex: boolean
      other: boolean
      stocks: boolean
    }>
  >
}

const Filters: React.FC<Props> = ({
  filters,
  handleApplyFilter,
  isFetchingCommodities,
  setFilters,
}) => {
  return (
    <Div row fill mb={32}>
      <FilterButton
        onClick={() => setFilters({ ...filters, stocks: !filters.stocks })}
        filterType={filters.stocks}
        label="Stocks"
      />
      <Div w={16} />
      <FilterButton
        onClick={() => setFilters({ ...filters, crypto: !filters.crypto })}
        filterType={filters.crypto}
        label="Crypto"
      />
      <Div w={16} />
      <FilterButton
        onClick={() => setFilters({ ...filters, forex: !filters.forex })}
        filterType={filters.forex}
        label="Forex"
      />
      <Div w={16} />
      <FilterButton
        onClick={() => setFilters({ ...filters, other: !filters.other })}
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

const styles = {
  button: {
    borderRadius: 24,
    color: "black",
    fontSize: 14,
  },
}

export default Filters
