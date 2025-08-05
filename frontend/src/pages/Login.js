import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      await login(email, password);
    } catch (err) {
      const errorMessage = await err.response.data.response;
      setErrorMessage(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white shadow-md rounded-lg p-8"
      >
        <div className="mb-4">
          <label
            htmlFor="emailId"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            EMAIL
          </label>
          <input
            type="email"
            id="emailId"
            name="emailId"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            PASSWORD
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>

        {errorMsg && <p className="text-red-500 text-sm mt-2">* {errorMsg}</p>}
        {/* Testing Credentials Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Testing Credentials
          </h3>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition"
              onClick={() => {
                setEmail("Developer@example.com");
                setPassword("Developer@123");
              }}
            >
              Use Developer Credentials
            </button>
            <button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition"
              onClick={() => {
                setEmail("Manager@example.com");
                setPassword("Manager@123");
              }}
            >
              Use Manager Credentials
            </button>
            <button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition"
              onClick={() => {
                setEmail("Admin@example.com");
                setPassword("Admin@123");
              }}
            >
              Use Admin Credentials
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
