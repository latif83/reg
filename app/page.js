"use client";
import Image from "next/image";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [activeBtn, setActiveBtn] = useState("sign-in");

  const [formData, setFormData] = useState(null);
  const [sData, setSData] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const submit = (formData) => {
    setFormData(formData);
    setSData(true);
  };

  const router = useRouter();

  useEffect(() => {
    const login = async () => {
      try {
        setLoading(true);

        const data = {
          email: formData.get("email"),
          password: formData.get("password"),
          role: formData.get("role"),
        };

        const response = await fetch("/api/login", {
          method: "POST",
          body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
          toast.error(responseData.error);
          setLoading(false);
          return;
        }

        toast.success(responseData.message);

        router.push(responseData.roleIs);
      } catch (err) {
        console.log(err);
        setLoading(false);
        toast.error("Request not sent, try again later!");
      }
    };

    if (sData) {
      login();
      setSData(false);
    }
  }, [sData]);

  return (
    <div style={{ height: "100svh" }} className="relative">
      <div
        className={`bg-blue-700 absolute top-0 left-0 w-full ${styles.banner}`}
        style={{ height: "50%" }}
      ></div>
      <div className="relative z-50 flex justify-center items-center w-full h-full">
        <div className="w-full bg-white overflow-hidden rounded-lg border-2 border-blue-700 shadow md:mt-0 sm:max-w-md xl:p-0 sm:mx-0 mx-3">
          <a
            href="#"
            className={`flex items-center flex-col justify-center mt-3 font-semibold text-gray-700 gap-2`}
          >
            <img
              className="w-8 h-8 mr-2"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
              alt="logo"
            />
            <span className={`${styles.marquee}`}>
              Employee Attendance & Appointment Management System
            </span>
          </a>

          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" action={submit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Your email
                </label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                    placeholder="name@company.com"
                    required
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-[18px] h-[18px] absolute right-4"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="10"
                      cy="7"
                      r="6"
                      data-original="#000000"
                    ></circle>
                    <path
                      d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Password
                </label>

                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                    required
                  />
                  {!showPassword ? (
                    <svg
                      onClick={() => setShowPassword((prev) => !prev)}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      className="w-[18px] h-[18px] absolute right-4 cursor-pointer"
                      viewBox="0 0 128 128"
                    >
                      <path
                        d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                        data-original="#000000"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      onClick={() => setShowPassword((prev) => !prev)}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-[18px] h-[18px] absolute right-4 cursor-pointer"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:bg-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    {" "}
                    <FontAwesomeIcon
                      icon={faSpinner}
                      spin
                      className="text-lg"
                    />{" "}
                    Sign in{" "}
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
              <p className="text-sm font-light text-gray-500">
                Login as{" "}
                <select
                  name="role"
                  className="bg-gray-800 text-white p-1 rounded text-sm"
                >
                  <option value="employees">Employee</option>
                  <option value="admins">Admin</option>
                </select>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
