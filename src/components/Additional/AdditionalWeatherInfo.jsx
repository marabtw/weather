const AdditionalWeatherInfo = ({ info, value, text, icon }) => {
  return (
    <div className="bg-[#121736] text-[#696e81]  flex justify-between rounded-[30px] px-[25px] py-[20px]">
      <div className="flex flex-col justify-between w-1/2">
        <span className="text-[1.3rem]">{info}</span>
        <span className="text-white text-[1.5rem]">{value}</span>
      </div>
      <div className="w-1/2 flex items-end">
        <div className="">
          {icon}
          <span className="text-[1rem]">{text}</span>
        </div>
      </div>
    </div>
  )
}

export default AdditionalWeatherInfo
