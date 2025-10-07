import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {useSendVerifyCodeMutation} from "../api/apiUser.js";



const Verification = () => {
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [sendVerifyCode] = useSendVerifyCodeMutation();

    const email = location.state?.email || "";



    const handleVerify = async () => {
        try {

            const response = await sendVerifyCode({ email, code });

            // RTK Query returns data in response.data or response.error
            const result = response.data || response.error?.data;

            if (result?.token) {
                // Successful verification
                localStorage.setItem("token", result.token);
                localStorage.setItem("Name", result.user?.fullName || "");
                setMessage("✅ Verified! Redirecting...");
                navigate("/");
            } else {
                // Failed verification
                setMessage(result?.message || "❌ Invalid code");
            }
        } catch (err) {
            console.error("Verification error:", err);
            setMessage("❌ Something went wrong. Try again.");
        }
    };



    return (
        <div style={{padding: "20px", maxWidth: "400px", margin: "0 auto"}}>
            <h2 style={{marginBottom: "20px"}}>Verification Page</h2>

            <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code"
                style={{display: "block", width: "100%", padding: "10px", marginBottom: "15px"}}
            />

            <button
                onClick={handleVerify}
                style={{
                    display: "block",
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginBottom: "15px"
                }}
            >
                Verify
            </button>

            {message && (
                <p style={{marginTop: "10px", color: String(message).includes("✅") ? "green" : "red"}}>
                    {String(message)}
                </p>
            )}
        </div>

    );
};

export default Verification;
