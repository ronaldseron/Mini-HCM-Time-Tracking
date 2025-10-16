import { Link } from "react-router-dom";

const Header = ({ userData, handleLogout }) => {
  return (
    <div className=" flex justify-between items-center rounded-md shadow py-4 mx-8 sm:px-8 bg-white">
      <div className="mb-4 sm:mb-0">
        <h2 className="text-2xl mb-1 font-bold text-gray-800">
          <span className="text-gray-500">Welcome, {userData?.name}!</span>
        </h2>
      </div>

      <div className="flex items-center space-x-3">
        <Link
          to="/users/dashboard"
          className="flex items-center text-base px-4 py-1 bg-white border border-gray-400 rounded-md shadow-sm hover:bg-gray-100 cursor-pointer"
        >
          <i className="bx bx-dashboard-alt text-xl mr-2"></i>
          <h1>Dashboard</h1>
        </Link>
        <Link
          to="/users/records"
          className="flex items-center text-base px-4 py-1 bg-white border border-gray-400 rounded-md shadow-sm hover:bg-gray-100 cursor-pointer"
        >
          <i className="bx bx-list-square text-xl mr-2"></i>
          <h1>Records</h1>
        </Link>
        <Link
          to="/users/history"
          className="flex items-center text-base px-4 py-1 bg-white border border-gray-400 rounded-md shadow-sm hover:bg-gray-100 cursor-pointer"
        >
          <i className="bx bx-list-square text-xl mr-2"></i>
          <h1>History</h1>
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
