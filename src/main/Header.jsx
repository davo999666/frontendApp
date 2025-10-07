import { navItems } from "../context/constants.js";
import { NavLink, useLocation } from "react-router-dom";
import ProfileHeader from "../accounting/ProfileHeader/ProfileHeader.jsx";

const Header = () => {
    const location = useLocation();
    if (location.pathname.startsWith("/games/")) {
        return null;
    }
    return (
        <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-3 shadow-md">
            {/* Left side nav items */}
            <div className="flex space-x-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item}
                        to={item === "home" ? "/" : `/${item}`}
                        className={({ isActive }) =>
                            `font-medium rounded-md px-4 py-2 transition ${
                                isActive ? "bg-blue-700 text-white" : "text-black hover:bg-blue-700"
                            }`
                        }
                    >
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                    </NavLink>
                ))}
            </div>

            {/* Right side profile */}
            <ProfileHeader />
        </header>
    );
};

export default Header;
