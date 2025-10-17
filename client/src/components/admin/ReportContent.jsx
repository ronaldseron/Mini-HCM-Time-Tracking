import { useState } from "react";
import { useReports } from "../../hooks/useReports";

const ReportContent = () => {
  const [activeTab, setActiveTab] = useState("daily");
  const [search, setSearch] = useState("");

  const {
    dailySummary,
    loadingDaily,
    dailyPage,
    setDailyPage,
    dailyPerPage,
    setDailyPerPage,
    totalDaily,

    weeklySummary,
    loadingWeekly,
    weeklyPage,
    setWeeklyPage,
    weeklyPerPage,
    setWeeklyPerPage,
    totalWeekly,
  } = useReports(activeTab);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const tabConfig = {
    daily: {
      data: dailySummary,
      loading: loadingDaily,
      page: dailyPage,
      setPage: setDailyPage,
      perPage: dailyPerPage,
      setPerPage: setDailyPerPage,
      total: totalDaily,
    },
    weekly: {
      data: weeklySummary,
      loading: loadingWeekly,
      page: weeklyPage,
      setPage: setWeeklyPage,
      perPage: weeklyPerPage,
      setPerPage: setWeeklyPerPage,
      total: totalWeekly,
    },
  };

  const { data, loading, page, setPage, perPage, setPerPage, total } = tabConfig[activeTab];

  const filteredData = data.filter((employee) =>
    employee.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(total / perPage) || 1;

  if (loading) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 m-8">
      <div className="h-full bg-white rounded-lg shadow-sm p-4">
        {/* Tabs */}
        <div className="flex border-b mb-4">
          {["daily", "weekly"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-600"
              }`}
            >
              {tab} summary
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="mb-4 md:mb-0">
            <label className="flex items-center text-sm text-gray-700">
              Show
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="text-sm mx-2 px-3 pr-8 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 100].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              entries
            </label>
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee..."
              className="w-full text-sm px-4 py-2 border border-gray-300 rounded-md pl-10 focus:ring-2 focus:ring-blue-500"
            />
            <i className="bx bx-search absolute left-3 top-3 text-gray-500 text-lg"></i>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100 border-b">
              <tr>
                {["#", "Name", "Reg. Hrs", "Late", "Overtime", "Undertime", "Night Dif."].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {filteredData.length > 0 ? (
                filteredData.map((employee, index) => {
                  const summary = employee.summary || {};
                  return (
                    <tr key={employee.name + index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{(page - 1) * perPage + index + 1}</td>
                      <td className="px-6 py-4">{employee.name}</td>
                      <td className="px-6 py-4">{summary.regular || "0.00"}</td>
                      <td className="px-6 py-4">{summary.late || "0.00"}</td>
                      <td className="px-6 py-4">{summary.overtime || "0.00"}</td>
                      <td className="px-6 py-4">{summary.undertime || "0.00"}</td>
                      <td className="px-6 py-4">{summary.nightDifferential || "0.00"}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-4">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 px-6 pb-4 text-sm text-gray-600">
          <p>
            Showing {filteredData.length} of {total} employees
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-3 py-1 border rounded ${
                page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className={`px-3 py-1 border rounded ${
                page >= totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportContent;
