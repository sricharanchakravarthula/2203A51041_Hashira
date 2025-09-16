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

// Convert large number string in base-N to BigInt
function baseToBigInt(valueStr, base) {
    let result = 0n;
    const b = BigInt(base);
    for (const ch of valueStr.toLowerCase()) {
        let digit;
        if (ch >= '0' && ch <= '9') {
            digit = BigInt(ch.charCodeAt(0) - '0'.charCodeAt(0));
        } else if (ch >= 'a' && ch <= 'z') {
            digit = BigInt(ch.charCodeAt(0) - 'a'.charCodeAt(0) + 10);
        } else {
            throw new Error(`Invalid character '${ch}' in value string`);
        }
        if (digit >= b) throw new Error(`Digit '${ch}' >= base ${base}`);
        result = result * b + digit;
    }
    return result;
}

// Convert roots from JSON to BigInt array
function convertRoots(rootsJSON) {
    const roots = [];
    for (const key in rootsJSON) {
        if (key === "keys") continue;
        const base = parseInt(rootsJSON[key].base);
        const value = rootsJSON[key].value;
        roots.push(baseToBigInt(value, base));
    }
    return roots;
}

// Main function
function main() {
    const data = JSON.parse(fs.readFileSync('roots.json', 'utf8'));

    const { n, k } = data.keys;
    const roots = convertRoots(data);

    if (roots.length < k) {
        console.error(`Error: Number of roots (${roots.length}) less than required k=${k}`);
        return;
    }

    // Only take first k roots
    const selectedRoots = roots.slice(0, k);

    // Expand polynomial
    const coeffs = expandPolynomial(selectedRoots);

    // Print results
    console.log("Selected roots (decimal):", selectedRoots);
    console.log("Expanded coefficients:", coeffs);
    console.log("Last constant term:", coeffs[coeffs.length - 1].toString());
}

main();
