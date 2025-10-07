import { useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCloud, rectCollision } from "../utils/function.js";
import {
    addSentenceKnow,
    addWordLearn,
    clearWordData,
} from "../features/word/wordSlice.js";
import { GameRefContext } from "../utils/gameScreenContext.js";
import { removeFirstItem } from "../features/word/sentencesSlice.js";

const Cloud = ({ clouds, setClouds }) => {
    const dispatch = useDispatch();
    const animationRef = useRef();
    const gameRef = useContext(GameRefContext);
    const currentSent = useSelector((state) => state.word.currentSent);
    const sentences = useSelector((state) => state.sentences);
    const processedRef = useRef(false);

    // Load new sentence data when all clouds disappear
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

    // Create clouds for current sentence
    useEffect(() => {
        if (!currentSent.length || !gameRef.current) return;

        let index = 0;

        const interval = setInterval(() => {
            if (index >= currentSent.length) {
                clearInterval(interval);
                return;
            }

            const word = currentSent[index];
            const x = Math.random() * gameRef.current.offsetWidth;
            const y = Math.random() * 80 - 80;
            const cloudInstance = createCloud(
                Math.floor(x),
                Math.floor(y),
                word,
                gameRef.current.offsetWidth,
                gameRef.current.offsetHeight
            );
            if (cloudInstance.x + cloudInstance.width > gameRef.current.offsetWidth) {
                cloudInstance.x = gameRef.current.offsetWidth - cloudInstance.width;
            }
            if (cloudInstance.x < 0) {
                cloudInstance.x = 0;
            }

            setClouds((prev) => [...prev, cloudInstance]);
            index++;
        }, 900); // ⏱ one cloud every second

        // 🧹 Cleanup
        return () => clearInterval(interval);
    }, [currentSent]);

    // Update size on screen resize
    useEffect(() => {
        setClouds((prev) => {
            prev.forEach((cloud) =>
                cloud.changeSize(gameRef.current.offsetWidth, gameRef.current.offsetHeight)
            );
            return [...prev];
        });
    }, [gameRef.current?.offsetWidth, gameRef.current?.offsetHeight]);

    // Animate cloud movement
    useEffect(() => {
        const gameWidth = gameRef.current.offsetWidth;
        const gameHeight = gameRef.current.offsetHeight;
        const animate = () => {
            setClouds((prevClouds) => {
                return prevClouds
                    .map((cloud) => {
                        cloud.moveCloud(gameWidth);
                        prevClouds.forEach((anotherCloud) => {
                            if (cloud !== anotherCloud && rectCollision(cloud, anotherCloud)) {
                                cloud.collision(anotherCloud);
                            }
                        });
                        return cloud;
                    })
                    .filter((cloud) => cloud.y <= gameHeight + cloud.height);
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationRef.current);
    }, [setClouds]);

    // Draw clouds
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
            {cloud.word}
          </span>
                </div>
            ))}
        </>
    );
};

export default Cloud;
