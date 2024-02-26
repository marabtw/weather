import Link from "next/link"

const NavBar = () => {
  return (
    <main className="flex text-white px-[50px] py-[10px] bg-[#121736] justify-between items-center">
      <h1 className="text-[1.5rem]">Weather</h1>
      <ul className="flex gap-[10px] items-center relative">
        <Link
          className="px-[10px] relative text-[1.1rem]
					before:content-[''] before:absolute before:-bottom-1 before:left-0 before:bg-slate-100 before:w-0 before:h-[2px] before:transition-['width'] before:duration-300
					hover:before:w-full"
          href={"/"}
        >
          Main
        </Link>
        <Link
          className="px-[10px] relative text-[1.1rem]
					before:content-[''] before:absolute before:-bottom-1 before:left-0 before:bg-slate-100 before:w-0 before:h-[2px] before:transition-['width'] before:duration-300
					hover:before:w-full"
          href={"/settings"}
        >
          Settings
        </Link>
      </ul>
    </main>
  )
}

export default NavBar
