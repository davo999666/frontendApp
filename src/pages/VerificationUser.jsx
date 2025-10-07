import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRestorePasswordMutation } from "../api/apiUser.js";

const VerificationUser = () => {
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [sendVerifyCode] = useRestorePasswordMutation();

    const email = location.state?.email || "";

    const handleVerify = async () => {
        try {
            const response = await sendVerifyCode({ email, code, newPassword });
            const result = response.data || response.error?.data;

            if (result?.token) {
                localStorage.setItem("token", result.token);
                localStorage.setItem("Name", result.fullName || "");
                navigate("/Profile");
            } else {
                alert(result?.message || "Verification failed");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
            <h2 style={{ marginBottom: "20px" }}>Verification Page</h2>

            <label className="block mb-2 font-medium">Enter Verification Code</label>
            <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code"
                className="border border-gray-300 rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block mb-2 font-medium">Enter New Password</label>
            <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="border border-gray-300 rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
                type="button" // important to prevent form reload
                onClick={handleVerify}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition text-lg font-semibold"
            >
                Verify
            </button>
        </div>
    );
};

export default VerificationUser;
