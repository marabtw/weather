export const metadata = {
  title: "Weather Settings",
  description: "Weather settings",
}

const Settings = () => {
  return (
    <div className="">
			<div className="flex flex-col gap-[10px] mx-auto bg-[#121736] min-w-[300px] max-w-[400px] text-center py-[10px] px-[25px] rounded-[30px] mt-[20px]">
				<h2>Settings</h2>
				<div className="flex justify-between py-[10px]">
					<h3>Datk mode</h3>
					<label>switch</label>
				</div>
				<div className="flex justify-between py-[10px]">
					<h3>Save History</h3>
					<label>switch</label>
				</div>
				<div className="flex justify-between py-[10px]">
					<h3>Change Unit</h3>
					<label>switch</label>
				</div>
			</div>
    </div>
  )
}

export default Settings
