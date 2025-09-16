const fs = require('fs');

// Multiply two polynomials
function multiplyPoly(a, b) {
    const result = Array(a.length + b.length - 1).fill(0);
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
            result[i + j] += a[i] * b[j];
        }
    }
    return result;
}

// Expand polynomial from roots
function expandPolynomial(roots) {
    let poly = [1]; // start with 1
    for (const r of roots) {
        poly = multiplyPoly(poly, [1, -r]); // (x - r)
    }
    return poly;
}

// Convert base-N roots to decimal
function convertRoots(base, roots) {
    return roots.map(r => parseInt(r, base));
}

// Main
function main() {
    const data = JSON.parse(fs.readFileSync('roots.json', 'utf8'));

    const n = data.n;
    const k = data.k;
    const base = data.base;
    const rootsBase = data.roots;

    const roots = convertRoots(base, rootsBase);

    const coeffs = expandPolynomial(roots);

    console.log(`Input roots (base ${base}): ${rootsBase}`);
    console.log(`Converted roots (decimal): ${roots}`);
    console.log(`Expanded coefficients: ${coeffs}`);
    console.log(`Last constant term: ${coeffs[coeffs.length - 1]}`);
}

main();
