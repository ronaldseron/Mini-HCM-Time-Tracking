import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getEmployeePunches, updateUserPunch } from "../../services/adminService";
import { useAuth } from "../../contexts/AuthContext";
import ToastNotification from "../ToastNotification";
import { formatTime } from "../../utils/timeFormat";

const PunchModal = ({ showModal, setShowModal, selectedEmployee }) => {
  const { getUserToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [punches, setPunches] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedPunch, setEditedPunch] = useState({});
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  useEffect(() => {
    if (!showModal || !selectedEmployee) return;

    const fetchPunches = async () => {
      setLoading(true);
      try {
        const token = await getUserToken();
        const res = await getEmployeePunches(selectedEmployee.id, token);
        setPunches(res.data || []);
      } catch (err) {
        console.error("Error fetching punches:", err);
        setPunches([]);
        setToast({ show: true, type: "error", message: "Failed to load punches." });
      } finally {
        setLoading(false);
      }
    };

    fetchPunches();
  }, [showModal, selectedEmployee, getUserToken]);

  const handleEdit = (id) => {
    const punchToEdit = punches.find((p) => p.id === id);
    setEditId(id);

    setEditedPunch({
      ...punchToEdit,
      timeIn: formatTime(punchToEdit.timeIn),
      timeOut: formatTime(punchToEdit.timeOut)
    });
  };

  const handleTimeInputChange = (e, fieldName) => {
    const { value } = e.target;
    setEditedPunch((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPunch((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!editedPunch || !editId) return;

    const addAmPm = (time) => {
      if (!time) return "";
      const [hours, minutes, seconds] = time.split(":").map(Number);
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      return `${String(displayHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} ${period}`;
    };

    try {
      const token = await getUserToken();
      const res = await updateUserPunch(selectedEmployee.id, token, editId, editedPunch);

      if (res.success) {
        setPunches((prev) =>
          prev.map((p) =>
            p.id === editId
              ? {
                  ...p,
                  ...editedPunch,
                  timeIn: addAmPm(editedPunch.timeIn),
                  timeOut: addAmPm(editedPunch.timeOut),
                }
              : p
          )
        );
        setToast({ show: true, type: "success", message: "Punch updated successfully!" });
      } else {
        setToast({ show: true, type: "error", message: "Update failed." });
      }

      setEditId(null);
    } catch (err) {
      setToast({ show: true, type: "error", message: "Something went wrong." });
    } finally {
      setTimeout(() => setToast({ show: false, message: "" }), 3000);
    }
  };

  if (!showModal) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex justify-center items-center z-[9999]">
      <div className="bg-white w-full max-w-[80%] rounded-md shadow-lg p-6 relative">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {selectedEmployee?.name} - Punch Records
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : punches.length > 0 ? (
          <div className="overflow-x-auto max-h-96">
            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-gray-100 border-b">
                <tr>
                  {["Date", "Time In", "Time Out", "Action"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {punches.map((punch) => (
                  <tr key={punch.id}>
                    <td className="px-4 py-2">
                      {editId === punch.id ? (
                        <input
                          type="text"
                          name="date"
                          value={editedPunch.date}
                          onChange={handleInputChange}
                          className="border-b py-1 outline-none"
                        />
                      ) : (
                        punch.date
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editId === punch.id ? (
                        <input
                          type="time"
                          step="1"
                          name="timeIn"
                          value={editedPunch.timeIn || ""}
                          onChange={(e) => handleTimeInputChange(e, "timeIn")}
                          className="border-b py-1 outline-none"
                        />
                      ) : (
                        punch.timeIn
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editId === punch.id ? (
                        <input
                          type="time"
                          step="1"
                          name="timeOut"
                          value={editedPunch.timeOut || ""}
                          onChange={(e) => handleTimeInputChange(e, "timeOut")}
                          className="border-b py-1 outline-none"
                        />
                      ) : (
                        punch.timeOut
                      )}
                    </td>
                    <td>
                      {editId === punch.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleSave}
                            className="px-4 py-0.5 bg-green-600 text-white text-sm rounded-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="px-4 py-0.5 bg-red-600 text-white text-sm rounded-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(punch.id)}
                          className="flex items-center gap-2 px-4 py-1 text-blue-500 hover:text-blue-900"
                        >
                          <i className="bx bx-edit text-xl"></i> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No punches found.</p>
        )}
      </div>

      <ToastNotification show={toast.show} type={toast.type} message={toast.message} />
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default PunchModal;