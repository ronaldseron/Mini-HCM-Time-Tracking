import { Link, useLocation } from "react-router-dom";

const Header = ({ userData, handleLogout }) => {
  const location = useLocation();

  const linkClasses = (path) =>
    `flex items-center text-base px-4 py-1 border rounded-md shadow-sm cursor-pointer ${
      location.pathname === path
        ? "bg-accent text-white border-accent"
        : "bg-white border-gray-400 text-gray-800 hover:bg-gray-100"
    }`;

  return (
    <div className=" flex justify-between items-center rounded-md shadow py-4 mx-8 sm:px-8 bg-white">
      <div className="mb-4 sm:mb-0">
        <h2 className="text-3xl font-bold">
          <span className="">Welcome, {userData?.name}</span>
        </h2>
      </div>

      <div className="flex items-center space-x-3">
        <Link
          to="/admin/dashboard"
          className={linkClasses("/admin/dashboard")}
        >
          <i className="bx bx-dashboard-alt text-lg mr-2"></i>
          <h1 className="font-medium text-sm">Dashboard</h1>
        </Link>
        <Link
          to="/admin/reports"
          className={linkClasses("/admin/reports")}
        >
          <i className="bx bx-list-square text-xl mr-2"></i>
          <h1>Reports</h1>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center text-base px-4 py-1 bg-white border border-gray-400 rounded-md shadow-sm hover:bg-gray-100 cursor-pointer ml-4"
        >
          <i className="bx bx-arrow-out-left-square-half text-xl mr-2"></i>
          <h1>Logout</h1>
        </button>
      </div>
    </div>
  );
};

export default Header;
