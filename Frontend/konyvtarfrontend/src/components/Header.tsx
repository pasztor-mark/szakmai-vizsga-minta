
export default function Header() {

   return (
        <header className="w-full min-h-16 bg-gray-800 text-white flex justify-between items-center p-4">
        <nav className="flex flex-row items-center gap-6">
            <h1 className="text-2xl font-bold">Petrik Könyvtár Nyilvántartó</h1>
            <ul className="flex flex-row gap-4">
                <li><a href="#newBook" className="hover:text-gray-400">Új könyv felvétele</a></li>
                <li><a target="_blank" href="https://petrik.hu" className="hover:text-gray-400">Petrik Honlap</a></li>
            </ul>
        </nav>
        </header>
    )
}
