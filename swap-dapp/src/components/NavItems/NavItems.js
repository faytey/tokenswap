import { Link, Outlet } from "react-router-dom";

function NavItems() {
  return (
    <main className="bg-purple-900 px-8 py-4 rounded-md shadow-md shadow-yellow-500">
      <nav>
        <ul className="flex flex-col gap-4 md:flex-row md:gap-8 items-center text-yellow-100 text-xl">
          <li className="shadow-yellow-500 shadow-sm p-2 md:shadow-none md:p-0 ">
            <Link to="/">Get Init Tokens</Link>
          </li>
          <li className="shadow-yellow-500 shadow-sm p-2 md:shadow-none md:p-0 ">
            <Link to="/swap">Get Swap Tokens</Link>
          </li>
          <li className="shadow-yellow-500 shadow-sm p-2 md:shadow-none md:p-0 ">
            <Link to="/swapper">Visit Swap</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </main>
  );
}

export default NavItems;
