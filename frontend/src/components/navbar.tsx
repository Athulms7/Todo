
import UserDropdown from "./avatardrop";


export default function NavBar() {
  

  return (
    <header className="w-full bg-black text-white px-8 py-3 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-4">
        <span className="font-bold text-lg">📝 TaskFlow</span>
        <nav className="space-x-4">
          {/* <button onClick={() =>router("/tasklist") } className="hover:underline">TaskList</button> */}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        {/* <ModeToggle /> */}
        <UserDropdown/>
      </div>
    </header>
  );
}
