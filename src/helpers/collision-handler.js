
import React, { useEffect, useRef } from "react";
import { handleFlip } from "../components/PreviewArea";

const handleSpritesFlip = (spritesToFlip) => {
    if (!Array.isArray(spritesToFlip) || spritesToFlip.length === 0) return;
    spritesToFlip.forEach(handleFlip); // Flip the sprites after collision
}

const checkCollision = (spriteA, spriteB) => {
    const elA = document.getElementById(`${spriteA}-div`);
    const elB = document.getElementById(`${spriteB}-div`);
    if (!elA || !elB) return false;

    const rectA = elA.getBoundingClientRect();
    const rectB = elB.getBoundingClientRect();

    // Check for collision by verifying that their bounding boxes overlap
    return (
        rectA.left < rectB.right &&
        rectA.right > rectB.left &&
        rectA.top < rectB.bottom &&
        rectA.bottom > rectB.top
    );
};

const handleMoveClick = (spriteId, steps) => {
    const el = document.getElementById(`${spriteId}-div`);
    // const el = document.getElementById(componentId);
    const facingDirection = el.style.transform === 'scaleX(-1)' ? -1 : 1;
    var left = el.offsetLeft;
    el.style.position = 'relative';
    el.style.left = left + facingDirection * steps + 'px';
  };

export const CollisionHandler = ({ running }) => {
    const intervalRef = useRef(null); // Reference for the interval

    useEffect(() => {
        if (!running) return;

        intervalRef.current = setInterval(() => {
            const el1 = document.getElementById(`sprite0-div`);
            const el2 = document.getElementById(`sprite1-div`);

            if (el1 && el2) {
                const collided = checkCollision("sprite0", "sprite1");
                if (collided) {
                    console.log("Collided");
                    handleFlip("sprite0");
                    handleFlip("sprite1");

                    setTimeout(()=>{
                        handleMoveClick("sprite0", 100);
                        handleMoveClick("sprite1", 100);
                    },2000)

                    // Clear the interval to stop checking for collisions
                    clearInterval(intervalRef.current);
                }
            }
        }, 10);

        // Cleanup function to clear the interval when the component unmounts
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [running]);

    return null;
};
