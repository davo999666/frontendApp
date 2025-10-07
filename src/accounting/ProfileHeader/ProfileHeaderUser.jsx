import { useNavigate } from "react-router-dom";
import {store} from "../../store/store.js";
import {gameApi} from "../../api/apiGame.js";
import {accountApi} from "../../api/apiUser.js";
import {useSelector} from "react-redux";
import {clearUser} from "../../features/userDataSlice.js";

const ProfileHeaderUser = ({ setOpen }) => {
    const navigate = useNavigate();
    const userData = useSelector(state => state.userData);

    const handleSignOut = () => {
        store.dispatch({ type: 'LOGOUT' });
        store.dispatch(clearUser());
        // Reset RTK Query caches
        store.dispatch(accountApi.util.resetApiState());
        store.dispatch(gameApi.util.resetApiState());
        localStorage.removeItem("token");
        localStorage.removeItem("Name");
        setOpen(false);
        navigate("/");
    };

    const handleSettings = () => {
        setOpen(false);
        navigate("/settings");
    };

    return (
        <>
            <button
                onClick={handleSettings}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
                Settings
            </button>

            <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
                Sign Out
            </button>
        </>
    );
};

export default ProfileHeaderUser;
