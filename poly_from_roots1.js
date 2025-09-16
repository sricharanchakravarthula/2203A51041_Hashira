const fs = require('fs');

// Multiply two polynomials with BigInt coefficients
function multiplyPoly(a, b) {
    const result = Array(a.length + b.length - 1).fill(0n);
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
            result[i + j] += a[i] * b[j];
        }
    }
    return result;
}

// Expand polynomial from roots
function expandPolynomial(roots) {
    let poly = [1n]; // Start with 1
    for (const r of roots) {
        poly = multiplyPoly(poly, [1n, -r]); // (x - r)
    }
    return poly;
}

// Convert root string in base-N to BigInt
function convertRoot(base, value) {
    return BigInt('0b' + parseInt(value, base).toString(2));
}

// Convert roots from base-N to decimal BigInt
function convertRoots(rootsJSON) {
    const roots = [];
    for (const key in rootsJSON) {
        if (key === "keys") continue;
        const base = parseInt(rootsJSON[key].base);
        const value = rootsJSON[key].value;
        roots.push(BigInt(parseInt(value, base))); // parse base-N -> BigInt
    }
    return roots;
}

// Main
function main() {
    const data = JSON.parse(fs.readFileSync('roots.json', 'utf8'));

    const keys = data.keys;
    const n = keys.n;
    const k = keys.k;

    const rootsJSON = data;
    const roots = convertRoots(rootsJSON);

    if (roots.length < k) {
        console.error(`Error: Number of roots (${roots.length}) less than required k=${k}`);
        return;
    }

    // Only use first k roots (minimum needed)
    const selectedRoots = roots.slice(0, k);

    // Expand polynomial
    const coeffs = expandPolynomial(selectedRoots);

    console.log("Selected roots (decimal):", selectedRoots);
    console.log("Expanded coefficients:", coeffs);
    console.log("Last constant term:", coeffs[coeffs.length - 1].toString());
}

main();
