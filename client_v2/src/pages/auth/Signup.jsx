import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAPI } from "../../utils/apiCalls";
import SignupForm from "../../components/auth/SignupForm";

const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSignup = async (formData) => {
    console.log(formData);
    try {
      const response = await registerAPI(formData);
      if (response.status === 200) {
        navigate("/login");
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <SignupForm onSubmit={handleSignup} />
    </div>
  );
};

export default Signup;
