import SignIn from "../../accounting/Guest/SignIn.jsx";
import Profile from "../../accounting/Profile/Index.jsx";
import { useGetProfileQuery } from "../../api/apiUser.js";
import { useDispatch } from "react-redux";
import {addUser, clearUser} from "../../features/userDataSlice.js";
import { useEffect } from "react";
import {store} from "../../store/store.js";

const Home = () => {
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");

    const { data: user, error } = useGetProfileQuery(undefined, {
        skip: !token,
    });
    useEffect(() => {

        if (error && token) {
            store.dispatch({ type: 'LOGOUT' });
            localStorage.removeItem("token");
        }
    }, [error, token]);

    // Dispatch formatted user only once
    useEffect(() => {
        if (user) {
            const formattedUser = {
                ...user,
                birthday: new Date(user.birthday).toLocaleDateString(),
            };
            dispatch(addUser(formattedUser));
        }
    }, [user, dispatch]);
    return (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
            {token && !error ? <Profile /> : <SignIn />}
        </div>
    );
};

export default Home;
