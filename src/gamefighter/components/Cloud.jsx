import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCloud } from "../utils/function.js";
import {addSentenceKnow, addWordLearn, clearWordData,} from "../features/word/wordSlice.js";
import { removeFirstItem, addSentences } from "../features/word/sentencesSlice.js";
import { useLazyFetchSentencesQuery } from "../../api/apiGame.js";
import { setUserData } from "../features/user/userSlice.js";

const Cloud = ({ clouds, setClouds, gameRef }) => {
    const dispatch = useDispatch();
    const currentSent = useSelector((state) => state.word.currentSent);
    const sentences = useSelector((state) => state.sentences);
    const currentUser = useSelector((state) => state.user.currentUser);
    const [fetchSentences] = useLazyFetchSentencesQuery();
    const processedRef = useRef(false);

    // 🧩 Load new sentence data when all clouds disappear
    useEffect(() => {
        if (
            clouds.length === 0 &&
            sentences.currentSent.length > 0 &&
            !processedRef.current
        ) {
            const sentence = sentences.currentSent[0];
            if (sentence) {
                const [know, learn] = Object.entries(sentence)[0];
                dispatch(clearWordData());
                dispatch(addWordLearn(learn));
                dispatch(addSentenceKnow(know));
                dispatch(removeFirstItem());
            }
            processedRef.current = true;
        }

        if (clouds.length > 0) processedRef.current = false;
    }, [clouds.length, sentences.currentSent.length, dispatch]);

    // 🌥️ Create clouds for current sentence
    useEffect(() => {
        if (!currentSent.length || !gameRef.current) return;

        let index = 0;
        const interval = setInterval(() => {
            if (index >= currentSent.length) {
                clearInterval(interval);
                return;
            }

            const wordData = currentSent[index];
            const word =
                typeof wordData === "object" ? Object.keys(wordData)[0] : wordData;

            const x = Math.random() * gameRef.current.offsetWidth;
            const y = Math.random() * 80 - 80;

            const cloudInstance = createCloud(
                Math.floor(x),
                Math.floor(y),
                word,
                gameRef.current.offsetWidth,
                gameRef.current.offsetHeight
            );

            // Keep cloud inside bounds
            if (cloudInstance.x + cloudInstance.width > gameRef.current.offsetWidth) {
                cloudInstance.x = gameRef.current.offsetWidth - cloudInstance.width;
            }
            if (cloudInstance.x < 0) cloudInstance.x = 0;

            setClouds((prev) => [...prev, cloudInstance]);
            index++;
        }, 900);

        return () => clearInterval(interval);
    }, [currentSent]);

    // 🧠 Fetch new sentences when needed (moved from Game.jsx)
    useEffect(() => {
        if (!currentUser?.level || !currentUser?.know || !currentUser?.learn) {
            const savedUserData = localStorage.getItem("userData");
            if (savedUserData) {
                dispatch(setUserData(JSON.parse(savedUserData)));
            } else {
                console.warn("⚠️ No saved user data found");
                return;
            }
        }
        const token = localStorage.getItem("token");
        if (!token) {
            console.warn("⚠️ Token missing — skipping sentence fetch.");
            return;
        }
        if (
            sentences.currentSent.length < 5 &&
            currentUser?.level &&
            currentUser?.know &&
            currentUser?.learn
        ) {
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
    }, [currentUser, sentences.currentSent.length, fetchSentences, dispatch]);

    // ☁️ Render clouds
    return (
        <>
            {clouds.map((cloud, index) => (
                <div
                    key={index}
                    className="absolute"
                    style={{
                        left: cloud.x,
                        top: cloud.y,
                        width: cloud.width,
                        height: cloud.height,
                    }}
                >
                    <img
                        src={cloud.image}
                        alt="cloud"
                        className="absolute w-full h-full"
                        draggable={false}
                    />
                    <span
                        style={{
                            position: "absolute",
                            bottom: "2px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            color: "black",
                            fontWeight: "bold",
                            fontSize: `${
                                gameRef.current.offsetWidth <= 768
                                    ? (gameRef.current.offsetWidth / 100) * 4
                                    : (gameRef.current.offsetWidth / 100) * 2
                            }px`,
                        }}
                    >
            {typeof cloud.word === "object"
                ? Object.keys(cloud.word)[0]
                : cloud.word}
          </span>
                </div>
            ))}
        </>
    );
};

export default Cloud;
