import {useNavigate} from "react-router-dom";

const ProfileHeaderGust = ({setOpen}) => {
    const navigate = useNavigate();
    return (
        <>
            <button
                onClick={() => {
                    setOpen(false);
                    navigate("/");
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
                Sign In
            </button>
            <button
                onClick={() => {
                    setOpen(false);
                    navigate("/register");
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
                Sign Up
            </button>
        </>
    );
};

export default ProfileHeaderGust;