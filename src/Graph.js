import { useEffect, useRef, useState } from "react";

const pageOffset = ["voltage","current","power"];
const seriesOffset = {
    pv: 1,
    battery: 4,
    load: 7,
};

/**
 *
 * @param {object} param0
 * @param {any[]} param0.log
 */
export default function Graph ({ log }) {
    const [ page, setPage ] = useState("voltage");
    /** @type {import("react").MutableRefObject<HTMLCanvasElement>} */
    const canvasRef = useRef();

    const width = 400;
    const height = 300;

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");

            const pixelWidth = width * devicePixelRatio;
            const pixelHeight = height * devicePixelRatio;

            canvasRef.current.width = pixelWidth;
            canvasRef.current.height = pixelHeight;

            const maxVal = Math.ceil(getMaxVal(log, page));
            const duration = 60 * 60 * 1000; // 1 hour

            const gutterSize = 20;
            const innerWidth = pixelWidth - 2 * gutterSize;
            const innerHeight = pixelHeight - 2 * gutterSize;

            const yScale = innerHeight / maxVal;
            const xScale = innerWidth / duration;

            ctx.translate(gutterSize, gutterSize);

            ctx.strokeRect(0,0, innerWidth, innerHeight);

            // Horizontal Grid lines
            ctx.beginPath();
            for (let i = 0; i <= maxVal; i++) {
                ctx.moveTo(0, innerHeight - i * yScale);
                ctx.lineTo(innerWidth, innerHeight - i * yScale);
            }
            ctx.lineWidth = 0.5;
            ctx.stroke();

            if (log.length < 1) {
                return;
            }

            // Axis Labels
            ctx.textAlign = "right";
            ctx.strokeText("0", -5, innerHeight);
            ctx.strokeText(maxVal.toString(), -5, 0);
            const lastTime = new Date(log[log.length - 1][0]);
            const timeStart = new Date(+lastTime - duration);
            const formatter = new Intl.DateTimeFormat([], { timeStyle: "short" });
            ctx.strokeText(formatter.format(lastTime), innerWidth, innerHeight + 12);
            ctx.textAlign = "left";
            ctx.strokeText(formatter.format(timeStart), 0, innerHeight + 12);

            const now = Date.now();

            // Data Lines
            drawLine(ctx, log, now, innerWidth, innerHeight, xScale, yScale, seriesOffset.pv        + pageOffset.indexOf(page), "#ff0000");
            drawLine(ctx, log, now, innerWidth, innerHeight, xScale, yScale, seriesOffset.battery   + pageOffset.indexOf(page), "#00ff00");
            drawLine(ctx, log, now, innerWidth, innerHeight, xScale, yScale, seriesOffset.load      + pageOffset.indexOf(page), "#0000ff");
        }
    }, [log, page]);

    return (
        <div>
            <button onClick={() => setPage("voltage")} style={{fontWeight:page==="voltage"?"bold":"normal"}}>Voltage</button>
            <button onClick={() => setPage("current")} style={{fontWeight:page==="current"?"bold":"normal"}}>Current</button>
            <button onClick={() => setPage("power")} style={{fontWeight:page==="power"?"bold":"normal"}}>Power</button>
            <canvas ref={canvasRef} style={{ width, height }} />
        </div>
    )
}

function drawLine(ctx, log, now, innerWidth,innerHeight, xScale, yScale, dataOffset, colour) {
    ctx.beginPath();
    for (const point of log) {
        const d = new Date(point[0]);
        ctx.lineTo(innerWidth - (now - +d) * xScale, innerHeight - point[dataOffset] * yScale);
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = colour;
    ctx.stroke();
}

function getMaxVal (log, page) {
    const indices = Object.values(seriesOffset).map(v => v + pageOffset.indexOf(page));
    const vals = log.map(d => indices.map(i => d[i])).flat();
    return Math.max(...vals);
}