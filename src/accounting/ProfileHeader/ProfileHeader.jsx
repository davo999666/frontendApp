import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileHeaderUser from "./ProfileHeaderUser.jsx";
import ProfileHeaderGust from "./ProfileHeaderGust.jsx";

const ProfileHeader = () => {
    const [open, setOpen] = useState(false);
    const token = localStorage.getItem("token");


    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400 transition"
            >
                {token ? "🙂" : "👤"}
            </button>

            {open && (
                <div className="fixed top-16 right-4 w-40 bg-white shadow-lg rounded-lg py-2 z-50">
                    {token ? (
                        <ProfileHeaderUser setOpen={setOpen} />
                    ) : (
                        <ProfileHeaderGust setOpen={setOpen} />
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfileHeader;
