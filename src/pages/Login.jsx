import { useState } from "react";
import { useNavigate } from "react-router-dom";

// FIX: Mendefinisikan URL API dari environment variable
const API_URL = import.meta.env.VITE_API_URL;

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // FIX: Menggunakan API_URL
    fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          // FIX: Menggunakan API_URL
          fetch(`${API_URL}/auth/me`, {
            credentials: "include",
          })
            .then((res) => res.json())
            .then((userData) => {
              if (userData.user) {
                onLoginSuccess?.(userData.user);
                navigate("/");
              } else {
                setError("Login failed to persist session.");
              }
            });
        }
      })
      .catch(() => setError("Login failed."));
  };

  const handleGoogleLogin = () => {
    // FIX: Menggunakan API_URL
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Login</button>
        <button type="button" onClick={handleGoogleLogin}>Login with Google</button>
        <p className="switch">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign up</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
