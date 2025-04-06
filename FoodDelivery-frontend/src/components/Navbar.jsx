import React from 'react'
import { useAuthStore } from '../store/authstore.js'
import { Link } from 'react-router-dom'

const Navbar = () => {
    const { authUser } = useAuthStore();
    return (
        <div className='w-full flex justify-between items-center bg-white px-5'>
            <div>
                <img src="/logo.png" alt="" />
            </div>
            <Link to="/profile">
                <div className='flex gap-2 items-center justify-center'>
                    <div className='text-xl font-serif text-black'>{authUser.username}</div>
                    <div>
                        <img src={authUser?.profileImg || "/profile.jpg"} alt="" className='w-10 h-10 rounded-full' />
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default Navbar