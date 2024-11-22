import "./Icon.css";

/**
 *
 * @param {object} props
 * @param {string} props.name
 * @param {import('react').CSSProperties} [props.style]
 */
export default function Icon ({ name, style = {} }) {
    style.verticalAlign = style.verticalAlign || "middle";

    return (
        <svg className="Icon" style={style}>
            <use href={`${require('./img/sprites.svg').default}#${name}`} />
        </svg>
    );
}