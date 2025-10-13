import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getAllEmployees } from "../services/adminService";

export const useAdmin = () => {
    const { getUserToken } = useAuth();
    const [allEmployees, setAllEmployees] = useState([]);

    useEffect(() => {
        fetchAllEmployees();
    }, []);

    const fetchAllEmployees = async () => {
        const token = await getUserToken();
        const result = await getAllEmployees(token);

        console.log("Employees:", result.data);
        setAllEmployees(result.data);
    }

    return { allEmployees };
};