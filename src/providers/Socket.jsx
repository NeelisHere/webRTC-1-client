import React, { createContext, useContext, useMemo } from 'react'
import { io } from 'socket.io-client'

// const API_URL = 'http://localhost:8000'
const API_URL = 'https://webrtc-client-4hor.onrender.com'
const SocketContext = createContext(null)

export const useSocket = () => useContext(SocketContext)

const SocketProvider = ({ children }) => {
    const socket = useMemo(() => {
        return io(API_URL)
    }, [])
    return (
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider
