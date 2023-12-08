import { Link, Outlet } from "react-router-dom";

function NavItems() {
  return (
    <main className="bg-purple-900 px-8 py-4 rounded-md shadow-md shadow-yellow-500">
      <nav>
        <ul className="flex gap-8 text-yellow-100 text-xl">
          <li>
            <Link to="/">Get Init Tokens</Link>
          </li>
          <li>
            <Link to="/swap">Get Swap Tokens</Link>
          </li>
          <li>
            <Link to="/swapper">Visit Swap</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </main>
  );
}

export default NavItems;
