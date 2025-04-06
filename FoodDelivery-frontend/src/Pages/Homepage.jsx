import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useProductStore } from '../store/productstore.js';
import { useAuthStore } from '../store/authstore.js';

const Homepage = () => {
    const [showCreate, setShowCreate] = useState(false);
    const [product, setProduct] = useState({
        productname: '',
        productprice: '',
        productimg: '',
    });

    const addproduct = useProductStore((state) => state.addproduct);
    const { getallproducts, all_products } = useProductStore();
    const { authUser } = useAuthStore();

    useEffect(() => {
        getallproducts();
    }, []);

    const handleSubmit = async () => {
        if (!product.productname || !product.productprice || !product.productimg) {
            alert("Please fill all fields");
            return;
        }

        await addproduct(product);

        setProduct({ productname: '', productprice: '', productimg: '' });
        setShowCreate(false);
    };

    return (
        <div className="pt-5 relative">
            {/* Navbar */}
            <div className="sticky top-0 z-50">
                <Navbar />
            </div>

            {/* Main Content */}
            <div className='w-[95%] mx-auto pt-3'>
                <img src="/header_img.png" alt="header" />

                {/* Product Cards */}
                <div className='flex justify-evenly items-center flex-wrap gap-6 mt-5'>
                    {all_products?.length > 0 ? (
                        all_products.map((order, index) => (
                            <div key={index} className="card bg-base-100 w-80 shadow-md">
                                <figure className="h-52 w-full overflow-hidden">
                                    <img src={order.productimg} alt="product" className="w-full h-full object-cover" />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title text-xl">{order.productname}</h2>
                                    <p className="text-gray-600">₹{order.productprice}</p>
                                    <div className="card-actions justify-end">
                                        <button className="btn btn-primary">Buy Now</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 mt-10">No products available</p>
                    )}
                </div>

                {/* Create Product Button for Restaurant */}
                {authUser?.character === "restaurant" && (
                    <div className="flex justify-center mt-6">
                        <button
                            className="px-6 py-2 bg-blue-600 text-white rounded-xl"
                            onClick={() => setShowCreate(true)}
                        >
                            Create Product
                        </button>
                    </div>
                )}
            </div>

            {/* Create Product Modal */}
            {authUser?.character === "restaurant" && showCreate && (
                <div className="fixed inset-0 z-50 flex justify-center items-center">
                    {/* Background Blur */}
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

                    {/* Modal Content */}
                    <div className="relative z-10 bg-white p-6 rounded-xl w-[90%] max-w-lg shadow-xl">
                        <button
                            className="absolute top-2 right-3 text-xl font-bold"
                            onClick={() => setShowCreate(false)}
                        >
                            ✕
                        </button>

                        <h2 className="text-2xl font-bold mb-4 text-center">Create Product</h2>

                        <input
                            type="text"
                            placeholder="Product Name"
                            value={product.productname}
                            onChange={(e) => setProduct({ ...product, productname: e.target.value })}
                            className="input input-bordered w-full mb-3 border rounded px-3 py-2"
                        />

                        <input
                            type="number"
                            placeholder="Price"
                            value={product.productprice}
                            onChange={(e) => setProduct({ ...product, productprice: e.target.value })}
                            className="input input-bordered w-full mb-3 border rounded px-3 py-2"
                        />

                        <input
                            type="text"
                            placeholder="Image URL"
                            value={product.productimg}
                            onChange={(e) => setProduct({ ...product, productimg: e.target.value })}
                            className="input input-bordered w-full mb-3 border rounded px-3 py-2"
                        />

                        {product.productimg && (
                            <img
                                src={product.productimg}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-lg mx-auto mt-3"
                            />
                        )}

                        <button
                            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded mt-4 w-full"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Homepage;
