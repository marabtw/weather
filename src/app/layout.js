import "./globals.css"
import Header from "@/components/Header"

export const metadata = {
  title: "Weather App",
  description: "Weather app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#090d26] text-[#f0f0f0]">
				<Header />
        <main className="flex flex-col">
          {children}
        </main>
      </body>
    </html>
  )
}
