import { useDispatch } from "react-redux";
import { useState } from "react";
import { addGuessedWord } from "../features/word/wordSlice.js";

const Boom = ({ clouds, setClouds }) => {
    const dispatch = useDispatch();
    const [boom, setBoom] = useState(null);

    const handleClick = () => {
        if (!clouds[0]) return;
        const firstCloud = clouds[0];

        // 💥 show boom at first cloud
        setBoom({ x: firstCloud.x, y: firstCloud.y });

        // remove cloud + dispatch guessed word
        setClouds((prev) => prev.filter((c) => c !== firstCloud));
        dispatch(addGuessedWord(firstCloud.word));

        // hide boom after 600ms
        setTimeout(() => setBoom(null), 600);
    };

    return (
        <>
            {/* 💥 Boom effect */}
            {boom && (
                <span
                    className="absolute text-red-600 font-bold"
                    style={{
                        left: boom.x,
                        top: boom.y,
                        fontSize: "32px",
                        animation: "fadeOut 0.6s forwards",
                    }}
                >
          💥 BOOM!
        </span>
            )}

            {/* 👇 Only handle click area on first cloud */}
            {clouds[0] && (
                <div
                    className="absolute"
                    style={{
                        left: clouds[0].x,
                        top: clouds[0].y,
                        width: clouds[0].width,
                        height: clouds[0].height,
                        background: "transparent", // invisible click area
                    }}
                    onClick={handleClick}
                />
            )}
        </>
    );
};

export default Boom;
