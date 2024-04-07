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
          role : formData.get("role")
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
        toast.error("Request not sent, try again later!");
      }
    };

    if (sData) {
      login();
      setSData(false);
    }
  }, [sData]);

  return (
    <div className="h-screen relative">
      <div
        className={`bg-blue-700 absolute top-0 left-0 w-full ${styles.banner}`}
        style={{ height: "50%" }}
      ></div>
      <div className="relative z-50 flex justify-center items-center w-full h-full">
        <div class="w-full bg-white overflow-hidden rounded-lg border-2 border-blue-700 shadow md:mt-0 sm:max-w-md xl:p-0 sm:mx-0 mx-3">
          <a
            href="#"
            class={`flex items-center flex-col justify-center mt-3 font-semibold text-gray-700 gap-2`}
          >
            <img
              class="w-8 h-8 mr-2"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
              alt="logo"
            />
            <span className={`${styles.marquee}`}>
              Employee Attendance & Appointment Management System
            </span>
          </a>

          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Sign in to your account
            </h1>
            <form class="space-y-4 md:space-y-6" action={submit}>
              <div>
                <label
                  htmlFor="email"
                  class="block mb-2 text-sm font-medium text-gray-900"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  class="block mb-2 text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                  required
                />
              </div>
              <div class="flex items-center justify-between">
                <a
                  href="#"
                  class="text-sm font-medium text-blue-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                disabled={loading}
                class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:bg-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center gap-2"
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
              <p class="text-sm font-light text-gray-500">
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
