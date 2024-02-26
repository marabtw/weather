"use client"
import { useEffect, useState, useRef } from "react"
import { getCities } from "@/http/gets"

import { GrFormSearch } from "react-icons/gr"
import { FaHistory } from "react-icons/fa"

const SearchCity = ({ updateWeatherData }) => {
  const [bufer, setBufer] = useState({
    id: 0,
    data: [],
  })
  const [citiesData, setCitiesData] = useState([])
  const [history, setHistory] = useState([])
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsHistoryOpen(false)
        setCitiesData([])
        setSelectedItemId(null)
        setIsHistoryOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (citiesData.length < 1) {
      return
    }
    const handleKeyDown = (event) => {
      const currentIndex = selectedItemId
        ? citiesData.findIndex((item) => item.id === selectedItemId)
        : 0
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault()
        if (event.key === "ArrowDown" && currentIndex < citiesData.length - 1) {
          setSelectedItemId(citiesData[currentIndex + 1].id)
        } else if (event.key === "ArrowUp" && currentIndex > 0) {
          setSelectedItemId(citiesData[currentIndex - 1].id)
        }
      } else if (event.key === "Escape") {
        setCitiesData([])
        setSelectedItemId(null)
      } else if (event.key === "Enter") {
        saveHistory(
          citiesData[currentIndex].id,
          citiesData[currentIndex].coord.lat,
          citiesData[currentIndex].coord.lon,
          citiesData[currentIndex].name,
          citiesData[currentIndex].sys.country
        )
        updateWeatherData(
          citiesData[currentIndex].coord.lat,
          citiesData[currentIndex].coord.lon
        )
        setCitiesData([])
        setSelectedItemId(null)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [citiesData, selectedItemId])

  const saveHistory = (id, lat, lon, name, country) => {
    if (history.length > 0 && history[history.length - 1].id === id) {
      return
    }
    const newEntry = {
      id,
      lat,
      lon,
      name,
      country,
    }
    setHistory((prevState) => [...prevState, newEntry])
  }

  const handleInputChange = async (hint) => {
    if (!hint || hint.length <= 2) {
      setCitiesData([])
      setSelectedItemId(null)
      return
    }
    await getCities(hint)
      .then((res) => {
        if (res.list && res.list.length > 0) {
          setCitiesData(res.list)
          setSelectedItemId(res.list[0].id)
          setBufer(() => ({
            data: res.list,
            id: res.list[0].id,
          }))
        } else {
          setCitiesData([])
          setSelectedItemId(null)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleItemClick = (data) => {
    saveHistory(
      data.id,
      data.coord.lat,
      data.coord.lon,
      data.name,
      data.sys.country
    )
    updateWeatherData(data.coord.lat, data.coord.lon)
    setCitiesData([])
    setSelectedItemId(null)
  }

  return (
    <div
      ref={searchRef}
      className="absolute right-[40px] top-[40px] h-max font-semibold rounded-[10px] bg-[#fff]"
    >
      <label htmlFor="search" className="text-[#121736] relative flex">
        <GrFormSearch className="absolute top-[50%] left-[0] transform -translate-y-[50%] text-[1.8rem]" />
        <input
          id="search"
          type="text"
          placeholder="Search..."
          className="cursor-text text-[1rem] p-[5px] pl-[30px] pr-[30px] w-[300px] rounded-[10px] outline-none"
          onClick={() => {
            setIsHistoryOpen(false)
            setSelectedItemId(bufer.id)
            setCitiesData(bufer.data)
          }}
          onChange={(el) => {
            setIsHistoryOpen(false)
            handleInputChange(el.target.value)
          }}
        />
      </label>
      <FaHistory
        onClick={() => setIsHistoryOpen(true)}
        className="absolute h-full min-w-[25px] right-0 top-[50%] transform -translate-y-[50%] ml-[10px] pr-[4px] cursor-pointer text-[#121736] hover:text-[#4f46e5]"
      />
      {Array.isArray(citiesData) && citiesData.length > 0 && !isHistoryOpen && (
        <ul className="absolute w-full bottom-[-5px] -translate-y-[-100%] bg-[#fff] rounded-[10px] text-[#7b7d81]">
          {citiesData.map((item) => {
            return (
              <li
                key={item.id}
                className={`cursor-pointer hover:text-[#fff] hover:bg-[#121736] px-[10px] py-[5px] flex justify-between transition-background duration-50 ${
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
      {Array.isArray(history) && history.length > 0 && isHistoryOpen && (
        <ul className="absolute w-full bottom-[-5px] -translate-y-[-100%] bg-[#fff] rounded-[10px] text-[#7b7d81]">
          {history.map((item) => {
            return (
              <li
                key={Math.round(item.lat * Math.random())}
                className={`cursor-pointer hover:text-[#fff] hover:bg-[#121736] px-[10px] py-[5px] flex justify-between transition-background duration-50 ${""}`}
                onClick={() => {
                  setIsHistoryOpen(false)
                  updateWeatherData(item.lat, item.lon)
                }}
              >
                {item.name}
                <span>{item.country}</span>
              </li>
            )
          })}
          <li
            className={`cursor-pointer text-center text-[#ff5656] hover:bg-[#121736] px-[10px] py-[5px] ${""}`}
            onClick={() => {
              setHistory([])
            }}
          >
            Delete History
          </li>
        </ul>
      )}
    </div>
  )
}

export default SearchCity
