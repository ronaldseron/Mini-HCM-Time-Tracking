import { useState, useEffect } from "react";
import { useDashboard } from "../../hooks/useDashboard";
import PunchModal from "./PunchModal";

const TableContent = () => {
  const {
    allEmployees,
    loadingEmployees,
    totalEmployees,
    empPage,
    setEmpPage,
    empPerPage,
    setEmpPerPage,
  } = useDashboard();

  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);


  const openPunchModal = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const filteredEmployees = allEmployees.filter((e) =>
    e.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(totalEmployees / empPerPage);

  if (loadingEmployees) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 m-8">
      <div className="h-full bg-white rounded-lg">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <label className="flex items-center text-sm text-gray-700">
            Show
            <select
              value={empPerPage}
              onChange={(e) => setEmpPerPage(Number(e.target.value))}
              className="text-sm mx-2 px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 75, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            entries
          </label>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md pl-10 focus:ring-2 focus:ring-blue-500"
            />
            <i className="bx bx-search absolute left-3 top-3 text-gray-500 text-lg"></i>
          </div>
        </div>

        {/* Employee Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100 border-b">
              <tr>
                {["#", "Name", "Email", "Schedule", "Action"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp, i) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{(empPage - 1) * empPerPage + (i + 1)}</td>
                    <td className="px-6 py-4">{emp.name}</td>
                    <td className="px-6 py-4">{emp.email}</td>
                    <td className="px-6 py-4">
                      {emp.schedule?.start} AM - {emp.schedule?.end} PM
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openPunchModal(emp)}
                        className="flex items-center gap-2 px-4 py-1 border border-green-700 text-green-700 rounded-sm hover:text-green-900"
                      >
                        <i className="bx bx-eye text-xl"></i> View Punches
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 py-4">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4 px-6 pb-4 text-sm text-gray-600">
          <p>
            Showing {filteredEmployees.length} of {totalEmployees} employees
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEmpPage((p) => Math.max(1, p - 1))}
              disabled={empPage === 1}
              className={`px-3 py-1 border rounded ${
                empPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
            >
              Previous
            </button>
            <span>
              Page {empPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setEmpPage((p) => Math.min(totalPages, p + 1))}
              disabled={empPage >= totalPages}
              className={`px-3 py-1 border rounded ${
                empPage >= totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Punch Modal */}
      {showModal && (
        <PunchModal
          showModal={showModal}
          setShowModal={setShowModal}
          selectedEmployee={selectedEmployee}
        />
      )}
    </div>
  );
};

export default TableContent;
