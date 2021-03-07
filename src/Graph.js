import { useEffect, useRef, useState } from "react";

const pages = ["voltage","current","power","temperature"];
const seriesOffset = {
    pv: 1,
    battery: 4,
    load: 7,
};
const colours = ["#ff0000","#00ff00","#0000ff"];

/**
 *
 * @param {object} param0
 * @param {any[]} param0.log
 */
export default function Graph ({ log }) {
    const [ page, setPage ] = useState("voltage");
    /** @type {import("react").MutableRefObject<HTMLCanvasElement>} */
    const canvasRef = useRef();

    const width = 500;
    const height = 300;

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");

            const pixelWidth = width * devicePixelRatio;
            const pixelHeight = height * devicePixelRatio;

            canvasRef.current.width = pixelWidth;
            canvasRef.current.height = pixelHeight;

            const allSeries = getAllSeries(log, page);

            const maxVal = Math.ceil(Math.max(...allSeries.flat()));
            const duration = 60 * 60 * 1000; // 1 hour

            const gutterSizeTop = 20 * devicePixelRatio;
            const gutterSizeBottom = gutterSizeTop;
            const gutterSizeLeft = 20 * devicePixelRatio;
            const gutterSizeRight = 100 * devicePixelRatio;
            const innerWidth = pixelWidth - gutterSizeLeft - gutterSizeRight;
            const innerHeight = pixelHeight - gutterSizeTop - gutterSizeBottom;

            const yScale = innerHeight / maxVal;
            const xScale = innerWidth / duration;

            ctx.translate(gutterSizeTop, gutterSizeLeft);

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
            const fontSize = 9 * devicePixelRatio;
            ctx.font = `${fontSize}pt sans-serif`;
            ctx.textAlign = "right";
            ctx.fillText("0", -0.5 * fontSize, innerHeight);
            ctx.fillText(maxVal.toString(), -0.5 * fontSize, 0);
            const lastTime = new Date(log[log.length - 1][0]);
            const timeStart = new Date(+lastTime - duration);
            const formatter = new Intl.DateTimeFormat([], { timeStyle: "short" });
            ctx.fillText(formatter.format(lastTime), innerWidth, innerHeight + fontSize * 1.2);
            ctx.textAlign = "left";
            ctx.fillText(formatter.format(timeStart), 0, innerHeight + fontSize * 1.2);

            const now = Date.now();

            // Data Lines
            const graphParams = { innerWidth, innerHeight, xScale, yScale, duration, now };
            const labels = page === "temperature" ? ["Controller", "Battery"] : Object.keys(seriesOffset).map(ucFirst);
            const xValues = log.map(p => p[0]);
            allSeries.forEach((series, i) => {
                drawLine(ctx, xValues, series, graphParams, colours[i]);
            });
            labels.forEach((label, i) => {
                const lineHeight = 12 * devicePixelRatio;
                const keyLineWidth = 30;
                const padding = 10;

                ctx.beginPath();
                ctx.moveTo(innerWidth + padding, i * lineHeight);
                ctx.lineTo(innerWidth + padding + keyLineWidth, i * lineHeight);
                ctx.strokeStyle = colours[i];
                ctx.stroke();

                ctx.fillStyle = "#000";
                ctx.fillText(label, innerWidth + (padding * 2) + keyLineWidth, i * lineHeight + (lineHeight / 2));
            });
        }
    }, [log, page]);

    return (
        <div>
            {
                pages.map(p => <button key={p} onClick={() => setPage(p)} style={{fontWeight:page===p?"bold":"normal"}}>{ucFirst(p)}</button>)
            }
            <canvas ref={canvasRef} style={{ width, height }} />
        </div>
    )
}

function drawLine(ctx, xValues, yValues, graphParams, colour) {
    const { innerWidth, innerHeight, xScale, yScale, duration, now } = graphParams;
    ctx.beginPath();
    for (let i = 0; i < xValues.length; i++) {
        const value = yValues[i];
        const d = new Date(xValues[i]);
        const delta = now - +d;
        if (delta < duration) {
            ctx.lineTo(innerWidth - delta * xScale, innerHeight - value * yScale);
        }
        else {
            ctx.moveTo(innerWidth - delta * xScale, innerHeight - value * yScale);
        }
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = colour;
    ctx.stroke();
}

function getAllSeries(log, page) {
    let indices;

    if (page === "temperature") {
        indices = [10,11];
    } else {
        indices = Object.values(seriesOffset).map(v => v + pages.indexOf(page));
    }

    return indices.map(i => log.map(d => d[i]));
}

function ucFirst (text) {
    if (typeof text !== "string") return text;
    return text.substr(0, 1).toUpperCase() + text.substr(1);
}