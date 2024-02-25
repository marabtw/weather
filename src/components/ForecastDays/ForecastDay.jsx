const ForecastDay = ({ data }) => {
  return (
    <div className="bg-[#272f59] flex h-max rounded-[30px] justify-between">
      <div className="p-[20px] flex gap-[10px]">
        <img
          src={
            data
              ? `http://openweathermap.org/img/w/${data?.weather[0].icon}.png`
              : `/cloud.png`
          }
          className="min-w-[40px] aspect-square"
        />
        <div className="flex flex-col">
          <b className="text-[1.1rem]">Saturday</b>
          <span>{data?.weather[0].main}</span>
        </div>
      </div>
      <div className="bg-[#818cf8] rounded-[30px] flex justify-center items-center px-[20px] min-w-max">
        {Math.floor(data?.temp.day)}°C / {Math.floor(data?.temp.night)}°C
      </div>
    </div>
  )
}

export default ForecastDay
