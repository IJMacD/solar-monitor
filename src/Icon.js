/**
 *
 * @param {object} props
 * @param {string} props.name
 * @param {import('react').CSSProperties} [props.style]
 */
export default function Icon ({ name, style = {} }) {
    style.verticalAlign = style.verticalAlign || "middle";
    style.width = style.width || 32;
    style.height = style.height || 32;

    return (
        <svg style={style}>
            <use href={`${require('./img/sprites.svg').default}#${name}`} />
        </svg>
    );
}