import Link from "next/link"

export default function Header() {
  return (
    <header className="shadow-md bg-background shadow-black h-header-height">
      <nav className="flex items-center justify-between h-full px-4 mx-auto max-w-maxwidth">
        <Link href="/" className="font-bold">
          ✈️ Find My Hotel
        </Link>
      </nav>
    </header>
  )
}