import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mapFirebaseAuthError } from "../../utils/firebaseErrorMapper";

export const useLoginForm = (loginUser) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginUser(email, password);

      if (result.success) {
        if (result.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/users/dashboard");
        }
      } else {
        const friendlyError = result.error
          ? mapFirebaseAuthError(result.error)
          : "Login failed. Please try again.";
        setError(friendlyError);
      }
    } catch (err) {
      const friendlyError = mapFirebaseAuthError(err);
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    error,
    loading,
    showPassword,
    handleSubmit,
    handleChange,
    toggleShowPassword,
  };
};
