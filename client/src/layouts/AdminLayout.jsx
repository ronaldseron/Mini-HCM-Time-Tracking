import Header from "../components/employee/Header";
import { useAuth } from "../contexts/AuthContext";
import { logout } from "../services/authService";

const AdminLayout = () => {
  const { userData } = useAuth();

  return (
    <div className=" min-h-screen flex flex-col py-8 gap-8 bg-gray-100">
      {/* Header */}
      <Header userData={userData} handleLogout={logout} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col mx-8 bg-white rounded-md shadow">
        {children}
      </div>
    </div>
  )
}

export default AdminLayout
