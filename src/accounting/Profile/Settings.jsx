import { useSelector } from "react-redux";
import { useState } from "react";
import { useUpdateProfileFieldMutation } from "../../api/apiUser.js";

const ProfileDisplay = () => {
    const dataFromState = useSelector((state) => state.userData?.userData);
    const [open, setOpen] = useState(false);
    const [editKey, setEditKey] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [password, setPassword] = useState("");
    const [updateProfileField, { isLoading, error }] = useUpdateProfileFieldMutation();

    const keys = Object.keys(dataFromState || {});
    const keyList = [...keys, "password"];

    const handleClickKey = (key) => {
        setEditKey(key);
        setEditValue(dataFromState[key] || "");
    };
// hello
    const handleSave = async () => {
        try {
            await updateProfileField({
                field: editKey,
                value: editValue,
                password: password,
            }).unwrap();

            setEditKey(null);
            setEditValue("");
            setPassword("");
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    return (
        <div className="absolute top-16 left-4 mt-4 z-50 flex flex-col items-start">
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2"
                onClick={() => setOpen(!open)}
            >
                Change personal data
            </button>

            {open && (
                <div className="w-64 bg-gray-100 p-4 rounded shadow-lg">
                    <h2 className="text-lg font-bold mb-2">Your personal data</h2>

                    {keyList.length > 0 ? (
                        <ul className="space-y-1">
                            {keyList.map((k) => (
                                <li
                                    key={k}
                                    className="p-1 bg-white rounded hover:bg-gray-200 cursor-pointer"
                                    onClick={() => handleClickKey(k)}
                                >
                                    {`Change ${k.charAt(0).toUpperCase() + k.slice(1)}`}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No available</p>
                    )}

                    {/* Inline edit form under the key list */}
                    {editKey && (
                        <div className="mt-4 p-3 bg-white border rounded shadow flex flex-col gap-2">
                            <label className="font-medium">Your password</label>
                            <input
                                type="password"
                                className="w-full border rounded px-2 py-1"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <label className="font-medium">
                                {`New ${editKey === "birthdate" ? "Birthdate" : editKey.charAt(0).toUpperCase() + editKey.slice(1)}`}
                            </label>
                            <input
                                type={editKey === "birthdate" ? "date" : "text"}
                                className="w-full border rounded px-2 py-1"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                            />

                            {isLoading && <p className="text-blue-500 text-sm">Saving...</p>}
                            {error && <p className="text-red-500 text-sm">Error: {error?.data?.message || error.message}</p>}

                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                                    onClick={() => {
                                        setEditKey(null);
                                        setEditValue("");
                                        setPassword("");
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                                    onClick={handleSave}
                                    disabled={!password || !editValue}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfileDisplay;
