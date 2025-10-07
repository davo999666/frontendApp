import React, { useState } from "react";
import { useVerifyUserMutation } from "../../api/apiUser.js";
import { useNavigate } from "react-router-dom";

const RestorePassword = () => {
    const [email, setEmail] = useState('');
    const [verifyUser, { isLoading, error }] = useVerifyUserMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // ✅ prevent page reload
        try {
            const response = await verifyUser({email}).unwrap();
                navigate('/verificationUser', { state: { email } });

        } catch (err) {
            console.error("Verification failed:", err);
        }
    };

    return (
        <div className="max-w-sm mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                <label htmlFor="email" className="block text-sm font-medium">
                    Write your email
                </label>
                <input
                    id="email"
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
                >
                    {isLoading ? "Loading..." : "Send"}
                </button>

                {error && <p className="text-red-500 mt-2">Error verifying user</p>}
            </form>
        </div>
    );
};

export default RestorePassword;
