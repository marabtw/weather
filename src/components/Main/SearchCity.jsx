"use client"
import { useEffect, useState, useRef } from "react"
import { getCities } from "@/http/gets"

import { GrFormSearch } from "react-icons/gr"

const SearchCity = ({ updateWeatherData }) => {
  const [bufer, setBufer] = useState({
    id: 0,
    data: [],
  })
  const [cityData, setCityData] = useState([])
  const [selectedItemId, setSelectedItemId] = useState(null)
  const searchRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setCityData([])
        setSelectedItemId(null)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (cityData.length < 1) {
      return
    }
    const handleKeyDown = (event) => {
      const currentIndex = selectedItemId
        ? cityData.findIndex((item) => item.id === selectedItemId)
        : 0
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault()
        if (event.key === "ArrowDown" && currentIndex < cityData.length - 1) {
          setSelectedItemId(cityData[currentIndex + 1].id)
        } else if (event.key === "ArrowUp" && currentIndex > 0) {
          setSelectedItemId(cityData[currentIndex - 1].id)
        }
      } else if (event.key === "Escape") {
        setCityData([])
        setSelectedItemId(null)
      } else if (event.key === "Enter") {
        updateWeatherData(cityData[currentIndex].coord.lat, cityData[currentIndex].coord.lon)
        setCityData([])
        setSelectedItemId(null)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [cityData, selectedItemId])

  const handleInputChange = async (hint) => {
    if (!hint || hint.length <= 2) {
      setCityData([])
      setSelectedItemId(null)
      return
    }
    await getCities(hint)
      .then((res) => {
        setCityData(res.list)
        setSelectedItemId(res.list[0].id)
        setBufer(() => ({
          data: res.list,
          id: res.list[0].id,
        }))
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleItemClick = (data) => {
		updateWeatherData(data.coord.lat, data.coord.lon)
    setCityData([])
    setSelectedItemId(null)
  }

  return (
    <div
      ref={searchRef}
      className="absolute right-[40px] top-[40px] h-max font-semibold"
    >
      <label htmlFor="search" className="text-[#121736] relative">
        <GrFormSearch className="absolute top-[50%] left-[0] transform -translate-y-[50%] text-[1.8rem]" />
        <input
          id="search"
          type="text"
          placeholder="Search..."
          className="cursor-text text-[1rem] p-[5px] pl-[30px] w-[300px] rounded-[10px] outline-none"
          onClick={() => {
            setSelectedItemId(bufer.id)
            setCityData(bufer.data)
          }}
          onChange={(el) => {
            handleInputChange(el.target.value)
          }}
        />
      </label>
      {Array.isArray(cityData) && cityData.length > 0 && (
        <ul className="absolute w-full bottom-[-5px] -translate-y-[-100%] bg-[#fff] rounded-[10px] text-[#7b7d81]">
          {cityData.map((item, index) => {
            return (
              <li
                key={item.id}
                className={`cursor-pointer hover:text-[#fff] hover:bg-[#121736] px-[10px] py-[5px] flex justify-between ${
                  selectedItemId === item.id ? "bg-[#121736] text-[#fff]" : ""
                }`}
                onClick={() => handleItemClick(item)}
              >
                {item.name}
                <span>{item.sys.country}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default SearchCity
