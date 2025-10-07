import { useEffect, useRef, useState } from "react";
import starBackground from "../assets/images/screen/star_background_1000x5000.png";
import { handleFullScreen } from "../handlers/fullscreenHandlers.js";
import Cloud from "./Cloud.jsx";
import Boom from "./Boom.jsx";
import Translate from "./Translate.jsx";
import { rectCollision } from "../utils/function.js";

const Game = () => {
    const backgroundRef = useRef(null);
    const heightRef = useRef(0);
    const [clouds, setClouds] = useState([]);


    // 🌌 Single game loop
    useEffect(() => {
        if (!backgroundRef.current) return;
        const speed = 0.1;
        const loop = () => {
            const gameWidth = backgroundRef.current?.offsetWidth;
            const gameHeight = backgroundRef.current?.offsetHeight;
            if (!gameWidth || !gameHeight) return;

            // Scroll background
            heightRef.current += speed;
            if (heightRef.current >= 5000) heightRef.current = 0;
            backgroundRef.current.style.backgroundPosition = `0px ${heightRef.current}px`;

            // Move clouds + detect collision
            setClouds((prevClouds) =>
                prevClouds
                    .map((cloud) => {
                        cloud.moveCloud(gameWidth);
                        prevClouds.forEach((anotherCloud) => {
                            if (cloud !== anotherCloud && rectCollision(cloud, anotherCloud)) {
                                cloud.collision(anotherCloud);
                            }
                        });
                        return cloud;
                    })
                    .filter((cloud) => cloud.y <= gameHeight + cloud.height)
            );

            // Update sizes for responsive design
            setClouds((prev) => {
                prev.forEach((cloud) => cloud.changeSize(gameWidth, gameHeight));
                return [...prev];
            });

            requestAnimationFrame(loop);
        };

        loop();
    }, []);


    return (
        <div className="h-screen w-screen flex justify-center items-center bg-gray-900 overflow-hidden select-none">
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
                {/* Clouds & Boom share the same loop via props */}
                <Cloud clouds={clouds} setClouds={setClouds} gameRef={backgroundRef} />
                <Boom clouds={clouds} setClouds={setClouds} gameRef={backgroundRef} />
                <Translate />

                <button
                    onClick={() => handleFullScreen(backgroundRef)}
                    className="absolute top-[0.5px] right-[0.5px] text-amber-50 text-xl px-2 z-10 rounded-sm"
                    title="Toggle Fullscreen"
                >
                    ⛶
                </button>
            </div>
        </div>
    );
};

export default Game;
