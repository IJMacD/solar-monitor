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
 * @param {number[]} param0.limits
 */
 export function GraphController ({ log, limits = [] }) {
    const [ page, setPage ] = useState("voltage");

    if (log.length < 1) {
        return null;
    }

    return (
        <div>
            {
                pages.map(p => <button key={p} onClick={() => setPage(p)} style={{fontWeight:page===p?"bold":"normal"}}>{ucFirst(p)}</button>)
            }
            <SingleGraph log={log} page={page} limits={page === "voltage" ? limits : []} />
        </div>
    )
}
/**
 *
 * @param {object} param0
 * @param {DataPoint[]} param0.log
 * @param {string} param0.page
 * @param {import("react").CSSProperties} [param0.style]
 * @param {number[]} param0.limits
 */
export function SingleGraph ({ log, page, style = null, limits = [] }) {
    const duration = 60 * 60 * 1000; // 1 hour

    const cutOff = Date.now() - duration;

    const filteredLog = log.filter(e => +new Date(e[0]) > cutOff);

    if (filteredLog.length === 0) {
        return null;
    }

    const allSeries = getAllSeries(filteredLog, page);

    const labels = page === "temperature" ? ["Controller", "Battery"] : Object.keys(seriesOffset).map(ucFirst);

    const minVal = page === "voltage" ? 11 : (page === "temperature" ? 20 : null);

    return <Graph data={allSeries} labels={labels} duration={duration} style={style} limits={limits} minVal={minVal} />;
}

/** @typedef {[string, ...number[]]} DataPoint */

/**
 * @param {object} param0
 * @param {DataPoint[]} param0.data
 * @param {number} param0.duration
 * @param {string[]} param0.labels
 * @param {number} [param0.width]
 * @param {number} [param0.height]
 * @param {import("react").CSSProperties} [param0.style]
 * @param {number[]} [param0.limits]
 * @param {number} [param0.minVal]
 * @param {number} [param0.maxVal]
 */
export function Graph ({ data, duration, labels, width = 500, height = 300, style = null, limits = [], minVal = null, maxVal = null }) {
    /** @type {import("react").MutableRefObject<HTMLCanvasElement>} */
    const canvasRef = useRef();

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");

            const pixelWidth = width * devicePixelRatio;
            const pixelHeight = height * devicePixelRatio;

            canvasRef.current.width = pixelWidth;
            canvasRef.current.height = pixelHeight;

            const values = data.map(([d, ...values]) => values).flat();

            if (typeof maxVal !== "number") {
                maxVal = Math.ceil(Math.max(...values));
            }

            if (typeof minVal !== "number") {
                minVal = Math.floor(Math.min(0, ...values));
            }

            const gutterSizeTop = 20 * devicePixelRatio;
            const gutterSizeBottom = gutterSizeTop;
            const gutterSizeLeft = 20 * devicePixelRatio;
            const gutterSizeRight = 100 * devicePixelRatio;
            const innerWidth = pixelWidth - gutterSizeLeft - gutterSizeRight;
            const innerHeight = pixelHeight - gutterSizeTop - gutterSizeBottom;

            const yScale = innerHeight / (maxVal - minVal);
            const xScale = innerWidth / duration;

            ctx.translate(gutterSizeTop, gutterSizeLeft);

            // Horizontal Grid lines
            ctx.beginPath();
            for (let i = minVal; i <= maxVal; i++) {
                ctx.moveTo(0, innerHeight - (i - minVal) * yScale);
                ctx.lineTo(innerWidth, innerHeight - (i - minVal) * yScale);
            }
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = "#666";
            ctx.stroke();
            // Axes
            ctx.beginPath();
            ctx.moveTo(0, innerHeight - (-minVal) * yScale);
            ctx.lineTo(innerWidth, innerHeight - (-minVal) * yScale);
            ctx.lineWidth = 1;
            ctx.stroke();

            // Axis Labels
            const fontSize = 9 * devicePixelRatio;
            ctx.font = `${fontSize}pt sans-serif`;
            ctx.fillStyle = "#666";
            ctx.textAlign = "right";
            if (minVal !== 0) {
                ctx.fillText("0", -0.5 * fontSize, innerHeight - (-minVal) * yScale);
            }
            ctx.fillText(minVal.toString(), -0.5 * fontSize, innerHeight);
            ctx.fillText(maxVal.toString(), -0.5 * fontSize, 0);
            const lastTime = new Date(data[data.length - 1][0]);
            const timeStart = new Date(+lastTime - duration);
            const formatter = new Intl.DateTimeFormat([], { timeStyle: "short" });
            ctx.fillText(formatter.format(lastTime), innerWidth, innerHeight + fontSize * 1.2);
            ctx.textAlign = "left";
            ctx.fillText(formatter.format(timeStart), 0, innerHeight + fontSize * 1.2);

            // Limit Lines
            ctx.strokeStyle = "#f00";
            ctx.lineWidth = 0.5;
            ctx.setLineDash([4,4]);
            ctx.beginPath();
            for (const limit of limits) {
                ctx.moveTo(0, innerHeight - (limit - minVal) * yScale);
                ctx.lineTo(innerWidth, innerHeight - (limit - minVal) * yScale);
            }
            ctx.stroke();
            ctx.setLineDash([]);

            const now = Date.now();

            // Data Lines
            const graphParams = { innerWidth, innerHeight, xScale, yScale, duration, now, minVal };
            const xValues = data.map(p => p[0]);

            labels.forEach((label, i) => {
                const yValues = data.map(p => p[i + 1]);

                drawLine(ctx, xValues, yValues, graphParams, colours[i]);

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
    }, [data, labels, duration, height, width, limits]);

    const s = { ...{ width, maxWidth: "100%" }, ...style };

    return <canvas ref={canvasRef} style={s} />;
}

function drawLine(ctx, xValues, yValues, graphParams, colour) {
    const { innerWidth, innerHeight, xScale, yScale, duration, now, minVal } = graphParams;
    ctx.beginPath();
    for (let i = 0; i < xValues.length; i++) {
        const value = yValues[i];
        const d = new Date(xValues[i]);
        const delta = now - +d;
        if (delta < duration) {
            ctx.lineTo(innerWidth - delta * xScale, innerHeight - (value - minVal) * yScale);
        }
        else {
            ctx.moveTo(innerWidth - delta * xScale, innerHeight - (value - minVal) * yScale);
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

    return log.map(d => [ d[0], ...indices.map(i => d[i]) ]);
}

function ucFirst (text) {
    if (typeof text !== "string") return text;
    return text.substr(0, 1).toUpperCase() + text.substr(1);
}