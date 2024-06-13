"use client"
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styles from './resetPassword.module.css'
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export const ResetPassword = ({ setResetPassword }) => {

    const [loading, setLoading] = useState(false)

    const [password, setPassword] = useState("")
    const [cpassword, setCPassword] = useState("")

    const submit = async () => {

        setLoading(true)

        try {

            if (password != cpassword) {
                toast.error("Passwords do not match!")
                return
            }

            if (password == "password@123") {
                toast.error("New password cannot be same as previous password!")
                return
            }

            const response = await fetch('/api/users/resetpassword', { method: 'POST', body: JSON.stringify({ password }) })

            const responseData = await response.json()

            if (!response.ok) {
                toast.error(responseData.error)
                return
            }

            toast.success(responseData.message)

            setResetPassword(false)

        }
        catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => { }, [loading])

    return (
        <div className={`${styles.container} pt-12`}>
            <div className="w-full max-w-2xl mx-auto bg-gray-50 rounded-t shadow p-6 h-full">
                <div className="flex justify-between mb-5">
                    <div>
                        <h1 className="font-semibold">Reset Password</h1>
                        <p className="text-xs">You're required to change your default password!</p>
                    </div>

                </div>
                <form action={submit}>
                    <div className="relative z-0 w-full group mb-5">
                        <input
                            type="password"
                            name="nPassword"
                            id="nPassword"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label
                            htmlFor="nPassword"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            New Password
                        </label>
                    </div>

                    <div className="relative z-0 w-full group mb-5">
                        <input
                            type="password"
                            name="nPassword"
                            id="nPassword"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                            value={cpassword}
                            onChange={(e) => setCPassword(e.target.value)}
                        />
                        <label
                            htmlFor="nPassword"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Confirm Password
                        </label>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 disabled:bg-blue-200 hover:bg-blue-600 text-white font-medium rounded py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {loading ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Submit{" "}
                                </>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}