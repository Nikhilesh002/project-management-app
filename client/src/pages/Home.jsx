import { NavLink, Outlet } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gray-300">
      <nav className="bg-gray-800 p-4 shadow-md flex justify-center">
        <ul className="flex space-x-4">
          <li className="border p-1 rounded bg-gray-700 ">
            <NavLink
              to="/projects"
              className="text-gray-300 hover:text-white"
              activeClassName="text-white"
            >
              All Projects
            </NavLink>
          </li>
          <li className="border p-1 rounded bg-gray-700 ">
            <NavLink
              to="/create-project"
              className="text-gray-300 hover:text-white"
              activeClassName="text-white"
            >
              Create Project
            </NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}

export default Home;
