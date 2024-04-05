import { createContext } from "react"

export const LoginContext = createContext()

export const LoginContextProvider = ({children})=>{
    
    return (
<LoginContext.Provider>
{children}
</LoginContext.Provider>
    )
}