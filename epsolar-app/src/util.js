export function trimNumber(n, places = 2) {
  if (n === 0)
    return "0";
  return n.toFixed(places).replace(/[.0]+$/, "");
}
