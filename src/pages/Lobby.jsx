import React from 'react'
import { Outlet } from 'react-router-dom'

const Lobby = () => {
    return (
        <div>
            Lobby
            <Outlet></Outlet>
        </div>
    )
}

export default Lobby
