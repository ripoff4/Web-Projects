import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authstore.js';
import { useProductStore } from '../store/productstore.js';

const Profilepage = () => {
    const { authUser, logout } = useAuthStore();
    const { myorders, all_products, products, getmyproducts, deleteproduct } = useProductStore(); // all_products will hold orders after myorders()

    useEffect(() => {
        myorders(); // fetch orders on mount
    }, []);
    useEffect(() => {
        getmyproducts(); // fetch orders on mount
    }, []);

    return (
        <div className="bg-orange-400 min-h-screen flex items-center justify-center">
            <div className="w-[50%] bg-white bg-opacity-80 backdrop-blur-md p-10 rounded-xl shadow-lg flex flex-col items-center gap-5">
                <div className="avatar">
                    <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
                        <img src={authUser?.profileImg || '/profile.jpg'} alt="Profile" />
                    </div>
                </div>

                <div className="flex flex-col gap-5 w-full">
                    <p className="text-lg bg-white p-3 rounded-xl w-full font-serif">
                        Username: {authUser?.username}
                    </p>
                    <p className="text-lg bg-white p-3 rounded-xl w-full font-serif">
                        Email: {authUser?.email}
                    </p>
                </div>

                <div className="flex flex-col gap-5 w-full">
                    <p className="text-lg font-semibold">My Orders:</p>
                    <div className="flex flex-col gap-5">
                        {all_products?.length > 0 ? (
                            all_products.map((order, index) => (
                                <div key={index} className="bg-white p-4 rounded-xl w-full font-serif flex items-center gap-4 shadow-md">
                                    {/* Left: Product Image */}
                                    <img
                                        src={order.productimg}
                                        alt={order.productname}
                                        className="w-24 h-24 object-cover rounded-xl"
                                    />

                                    {/* Middle: Details */}
                                    <div className="flex-1">
                                        <p className="text-xl font-semibold">{order.productname}</p>
                                        <p className="text-sm text-gray-600 mt-1">By {order.restaurant.username}</p>
                                    </div>

                                    {/* Right: Price */}
                                    <div className="text-2xl font-bold text-green-600 whitespace-nowrap">
                                        ₹{order.productprice}
                                    </div>
                                </div>

                            ))
                        ) : (
                            <p className="text-gray-700">No orders yet.</p>
                        )}
                    </div>
                </div>
                <div className="w-full">
                    {authUser?.character === 'restaurant' && (
                        <>
                            <p className="text-lg font-semibold mb-3">Your Products:</p>
                            <div className="flex flex-col gap-5">
                                {products?.length > 0 ? (
                                    products.map((prod, index) => (
                                        <div key={index} className="relative bg-white p-4 rounded-xl w-full font-serif flex items-center gap-4 shadow-md">
                                            {/* Delete Button */}
                                            <button
                                                className="absolute top-2 right-2 text-red-500 text-xl font-bold hover:text-red-700"
                                                onClick={() => deleteproduct(prod._id)}
                                            >
                                                ✕
                                            </button>

                                            {/* Product Image */}
                                            <img
                                                src={prod.productimg}
                                                alt={prod.productname}
                                                className="w-24 h-24 object-cover rounded-xl"
                                            />

                                            {/* Product Details */}
                                            <div className="flex-1">
                                                <p className="text-xl font-semibold">{prod.productname}</p>
                                                <p className="text-sm text-gray-600 mt-1">You</p>
                                            </div>

                                            {/* Price */}
                                            <div className="text-2xl font-bold text-green-600 whitespace-nowrap">
                                                ₹{prod.productprice}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-700">You haven't created any products.</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
                <div className="flex gap-5">
                    <button className="bg-red-500 text-white p-3 rounded-xl" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profilepage;
