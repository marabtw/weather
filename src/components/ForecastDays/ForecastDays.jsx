import React from "react"
import ForecastDay from "./ForecastDay"

const ForecastDays = React.memo(({ dailyData }) => {
  return (
    <div className="min-w-[280px]">
      <h2 className="text-[1.7rem] mb-[20px]">
        <b>3 Days </b>Forecast
      </h2>
      <div className="grid gap-[15px]">
        {dailyData?.map((day, index) => (
          <ForecastDay key={day.dt + index} data={day} />
        ))}
      </div>
    </div>
  )
})

export default ForecastDays
