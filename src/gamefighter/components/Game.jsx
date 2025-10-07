import { useEffect, useRef, useState } from "react";
import starBackground from "../assets/images/screen/star_background_1000x5000.png";
import { handleFullScreen } from "../handlers/fullscreenHandlers.js";
import Cloud from "./Cloud.jsx";
import Boom from "./Boom.jsx";
import Translate from "./Translate.jsx";
import { GameRefContext } from "../utils/gameScreenContext.js";
import { useDispatch, useSelector } from "react-redux";
import { useLazyFetchSentencesQuery } from "../../api/apiGame.js";
import { addSentences } from "../features/word/sentencesSlice.js";
import {setUserData} from "../features/user/userSlice.js";

const Game = () => {
    const backgroundRef = useRef(null);
    const heightRef = useRef(0);
    const [clouds, setClouds] = useState([]);
    const currentSent = useSelector((state) => state.sentences.currentSent);
    const currentUser = useSelector((state) => state.user.currentUser);
    const [fetchSentences] = useLazyFetchSentencesQuery();
    const dispatch = useDispatch();

    // Background scrolling
    useEffect(() => {
        const speed = 0.2;
        const loop = () => {
            heightRef.current += speed;
            if (heightRef.current >= 5000) heightRef.current = 0;
            if (backgroundRef.current) {
                backgroundRef.current.style.backgroundPosition = `0px ${heightRef.current}px`;
            }
            requestAnimationFrame(loop);
        };
        loop();
    }, []);

    // Fetch sentences if less than 5
    useEffect(() => {
        // 1️⃣ If user data is missing, try to restore it
        if (!currentUser?.level || !currentUser?.know || !currentUser?.learn) {
            const savedUserData = localStorage.getItem("userData");
            if (savedUserData) {
                dispatch(setUserData(JSON.parse(savedUserData)));
            } else {
                console.warn("⚠️ No saved user data found");
                return;
            }
        }
        // 2️⃣ Make sure we have a token
        const token = localStorage.getItem("token");
        if (!token) {
            console.warn("⚠️ Token missing — skipping sentence fetch.");
            return;
        }
        // 3️⃣ Fetch only if we don’t already have enough sentences
        if (currentSent.length < 5 && currentUser?.level && currentUser?.know && currentUser?.learn) {
            const loadSentences = async () => {
                try {
                    const result = await fetchSentences({
                        level: currentUser.level,
                        know: currentUser.know,
                        learn: currentUser.learn,
                    });

                    if (result.data) {
                        dispatch(addSentences(result.data));
                    } else if (result.error) {
                        console.error("❌ Fetch error:", result.error);
                    }
                } catch (err) {
                    console.error("❌ Failed to fetch sentences:", err);
                }
            };

            loadSentences();
        }
    }, [currentUser?.level, currentUser?.know, currentUser?.learn, currentSent.length, fetchSentences, dispatch]);



    return (
        <div className="h-screen w-screen flex justify-center items-center bg-gray-900 overflow-hidden select-none">
            <GameRefContext.Provider value={backgroundRef}>
                <div
                    ref={backgroundRef}
                    className="h-full w-full md:w-[600px] lg:w-[800px] xl:w-[1000px] relative select-none"
                    style={{
                        backgroundImage: `url(${starBackground})`,
                        backgroundRepeat: "repeat",
                        backgroundSize: "cover",
                        userSelect: "none",
                    }}
                >
                    <Cloud clouds={clouds} setClouds={setClouds} />
                    <Boom clouds={clouds} setClouds={setClouds} />
                    <Translate />
                    <button
                        onClick={() => handleFullScreen(backgroundRef)}
                        className="absolute top-[0.5px] right-[0.5px] text-amber-50 text-xl px-2 z-10 rounded-sm"
                        title="Toggle Fullscreen"
                    >
                        ⛶
                    </button>
                </div>
            </GameRefContext.Provider>
        </div>
    );
};

export default Game;
