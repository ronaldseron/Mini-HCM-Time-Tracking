import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useLoginForm = (loginUser) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const { email, password } = formData;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await loginUser(email, password);

      if (result.success) {
        if (result.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/employee/dashboard');
        }
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
      
      console.log('Login successfully!');
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
