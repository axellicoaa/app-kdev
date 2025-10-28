"use client";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/kdevfull/auth/login",
        {
          username,
          password,
        }
      );

      const token = res.data.token;

      // ✅ Guardamos en cookie (middleware puede leerlo)
      Cookies.set("token", token, { expires: 1 }); // 1 día

      // opcional: también en localStorage si quieres
      localStorage.setItem("token", token);

      router.push("/dashboard");
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Iniciar sesión</h2>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <form onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <label className="block mb-4">
              <span className="text-sm text-gray-600">Usuario</span>
              <div className="mt-1 relative rounded-md shadow-sm">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {/* user icon */}
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M16 11c1.657 0 3-1.343 3-3S17.657 5 16 5s-3 1.343-3 3 1.343 3 3 3zM6 20v-1a4 4 0 014-4h4a4 4 0 014 4v1"
                    />
                  </svg>
                </span>

                <input
                  type="text"
                  placeholder="Usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                    error && (!username || !password)
                      ? "border-red-400"
                      : "border-gray-200"
                  }`}
                  autoComplete="username"
                  aria-label="username"
                />
              </div>
            </label>

            {/* Password */}
            <label className="block mb-4">
              <span className="text-sm text-gray-600">Contraseña</span>
              <div className="mt-1 relative rounded-md shadow-sm">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {/* lock icon */}
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 15v2M7 10a5 5 0 1110 0v2h1a1 1 0 011 1v6a1 1 0 01-1 1H6a1 1 0 01-1-1v-6a1 1 0 011-1h1V10z"
                    />
                  </svg>
                </span>

                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                    error && (!username || !password)
                      ? "border-red-400"
                      : "border-gray-200"
                  }`}
                  autoComplete="current-password"
                  aria-label="password"
                />
              </div>
            </label>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-md text-sm font-medium transition"
              >
                {loading ? (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                ) : null}
                Entrar
              </button>

              <a href="#" className="text-sm text-blue-600 hover:underline">
                ¿Olvidaste la contraseña?
              </a>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
