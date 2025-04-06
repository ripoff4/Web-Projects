import React from 'react'
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authstore.js';
import { Link } from 'react-router-dom';

const Loginpage = () => {
    const [newuser, setnewuser] = React.useState({
        username: "",
        email: "",
        password: ""
    });

    const { login, isError, errorMessage } = useAuthStore();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newuser.username || !newuser.email || !newuser.password) {
            toast.error("Please fill all fields");
        }
        await login(newuser);
        if (!isError) {
            toast.success("Login successful");
        } else {
            toast.error(errorMessage);
        }
    }
    return (
        <div
            className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: "url('/login.jpg')" }}
        >
            <div className="bg-white bg-opacity-80 backdrop-blur-md p-10 rounded-xl shadow-lg flex flex-col items-center gap-5 w-full max-w-md">
                <div className="text-2xl font-bold">Login Page</div>

                <input
                    type="text"
                    placeholder="Email"
                    className="input input-bordered w-full"
                    name="email"
                    value={newuser.email}
                    onChange={(e) => setnewuser({ ...newuser, email: e.target.value })}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="input input-bordered w-full"
                    name="password"
                    value={newuser.password}
                    onChange={(e) => setnewuser({ ...newuser, password: e.target.value })}
                />

                <button
                    className="btn btn-info w-full"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
                <div className='flex gap-1'>
                    <p>Don't have an Account?</p><Link to="/signup" className="text-blue-500">Signup</Link>
                </div>
            </div>
        </div>
    )
}

export default Loginpage