"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const AnimatedCounter = ({ value = 0, prefix = "", duration = 1.5 }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) =>
        Math.round(latest).toLocaleString(),
    );
    const [display, setDisplay] = useState("0");

    useEffect(() => {
        const controls = animate(count, value, {
            duration,
            ease: "easeOut",
        });

        const unsubscribe = rounded.on("change", (v) => setDisplay(v));

        return () => {
            controls.stop();
            unsubscribe();
        };
    }, [value, duration, count, rounded]);

    return (
        <motion.span>
            {prefix}
            {display}
        </motion.span>
    );
};

export default AnimatedCounter;
