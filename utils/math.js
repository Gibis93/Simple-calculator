
const math = (a, b, sign) =>
    sign === "+" ? a + b : sign === "-" ? a - b : sign === "x" ? a * b : a / b;
export { math };