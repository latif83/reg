"use client"
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styles from './forgetPassword.module.css'
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export const ForgetPassword = ({setForgetPassword}) => {
    const [currentSection, setCurrentSection] = useState(1)

    const [email, setEmail] = useState("")
    const [email2, setEmail2] = useState("")
    const [code, setCode] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [loading,setLoading] = useState(false)

    const [sendData,setSendData] = useState(false)
    const [sendData2,setSendData2] = useState(false)
    const [sendData3,setSendData3] = useState(false)

    const submit = async () => {
        setSendData(true)

    }

    const submit2 = () => {
        setSendData2(true)
    }

    const submit3 = async () => {
        setSendData3(true)

    }

    useEffect(()=>{

        const sData1 = async ()=>{
            if (!email) {
                toast.error("Please provide your email")
            }
            setLoading(true)
            function generateSixDigitCode() {
                return Math.floor(100000 + Math.random() * 900000);
            }
    
            const code = generateSixDigitCode();
    
            localStorage.setItem("PassEmail", email)
            localStorage.setItem("PassCode", code)
    
            //   comm with api to send code
            const response = await fetch('/api/password/reset/sendcode', {
                method: 'POST',
                body: JSON.stringify({ code, email }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
    
            const responseData = await response.json()
    
            if (!response.ok) {
                toast.error(responseData.error)
                setLoading(false)
                return
            }
    
            toast.success("A six (6) digit verification code has being sent to your mail!")
    
            setEmail2(email)
    
            setCurrentSection(2)
    
            setLoading(false)
        }

        const sData2 = async()=>{
            if (!email2) {
                toast.error("Please provide your email")
                return
            }
            if (!code) {
                toast.error("Please provide your six (6) digit code!")
                return
            }
    
            setLoading(true)
    
            const getEmail = localStorage.getItem("PassEmail")
            const getCode = localStorage.getItem("PassCode")
    
            if ((getEmail == email2) && (code == getCode)) {
                toast.success("Verified, Please set a new password")
                setCurrentSection(3)
                setLoading(false)
            } else {
                toast.error("Verification code is invalid!")
                setLoading(false)
            }
        }

        const sData3 = async()=>{
            if (password != confirmPassword) {
                toast.error("Passwords do not match")
                return
            }
    
            setLoading(true)
    
            const response = await fetch('/api/password/reset', {
                method: 'POST',
                body: JSON.stringify({ password, email:email2 }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
    
            const responseData = await response.json()
    
            if (!response.ok) {
                toast.error(responseData.error)
                setLoading(false)
                return
            }
    
            toast.success(responseData.message)
            setLoading(false)
            setForgetPassword(false)
        }

        if(sendData){
            sData1()
            setSendData(false)
        }

        if(sendData2){
            sData2()
            setSendData2(false)
        }

        if(sendData3){
            sData3()
            setSendData3(false)
        }

    },[sendData,sendData2,sendData3])

   

    return (
        <div className={`${styles.container} pt-12`}>
            <div className="w-full max-w-2xl mx-auto bg-gray-50 rounded-t shadow p-6 h-full">
                <div className="flex justify-between mb-5">
                    <h1 className="font-semibold">Forget Password</h1>
                    <FontAwesomeIcon
                        icon={faTimes}
                          onClick={() => setForgetPassword(false)}
                        className="text-lg cursor-pointer p-2 hover:bg-gray-300 rounded"
                        color="red"
                    />
                </div>

                <form>

                    {currentSection == 1 && <div>
                        <div className="relative z-0 w-full group mb-5">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label
                                htmlFor="email"
                                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Enter your Email
                            </label>
                        </div>

                        <div className="flex justify-end">
                        <button onClick={submit} disabled={loading} type="button" className="text-black block p-2 bg-blue-800 disabled:bg-blue-300 hover:bg-blue-600 text-white rounded-md">
                                {loading ? <><FontAwesomeIcon icon={faSpinner} width={15} height={15} spin /> Submit</> : 'Submit'}
                            </button>
                        </div>
                    </div>}

                    {currentSection == 2 && <div>
                        <div className="relative z-0 w-full group mb-5">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                                value={email2}
                                onChange={(e) => setEmail2(e.target.value)}
                                readOnly
                            />
                            <label
                                htmlFor="email"
                                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Enter your Email
                            </label>
                        </div>

                        <div className="relative z-0 w-full group mb-5">
                            <input
                                type="text"
                                name="code"
                                id="code"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                            <label
                                htmlFor="code"
                                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Enter the six (6) digit code sent to your mail.
                            </label>
                        </div>

                        <div className="flex justify-end">
                        <button onClick={submit2} disabled={loading} type="button" className="text-black block p-2 bg-blue-800 disabled:bg-blue-300 hover:bg-blue-600 text-white rounded-md">
                                {loading ? <><FontAwesomeIcon icon={faSpinner} width={15} height={15} spin /> Submit</> : 'Submit'}
                            </button>
                        </div>
                    </div>}

                    {currentSection == 3 && <div>
                        <div className="relative z-0 w-full group mb-5">
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label
                                htmlFor="password"
                                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Enter your new password
                            </label>
                        </div>

                        <div className="relative z-0 w-full group mb-5">
                            <input
                                type="password"
                                name="cpassword"
                                id="code"
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <label
                                htmlFor="code"
                                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                                Confirm your new password
                            </label>
                        </div>

                        <div className="flex justify-end">
                            <button onClick={submit3} disabled={loading} type="button" className="text-black block p-2 bg-blue-800 disabled:bg-blue-300 hover:bg-blue-600 text-white rounded-md">
                                {loading ? <><FontAwesomeIcon icon={faSpinner} width={15} height={15} spin /> Submit</> : 'Submit'}
                            </button>
                        </div>
                    </div>}

                </form>

            </div>
        </div>
    )
}