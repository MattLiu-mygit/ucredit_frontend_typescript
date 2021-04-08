import React, {useContext, useState, useEffect} from 'react'
import {auth} from "../firebase" // to be updated for Mongo in the future?

const AuthContext = React.createContext()
export function useAuth() {
    console.log("useAuth began")
    console.log(AuthContext.value)
    console.log(useContext(AuthContext))
    return useContext(AuthContext)
}
export function AuthProvider({ children }) {
    console.log("auth provider began")
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password)
    }

    useEffect(() => {
        const unsubsribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })
        return unsubsribe
    }, [])

    const value = {
        currentUser,
        signup
    }
    console.log(value)

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}