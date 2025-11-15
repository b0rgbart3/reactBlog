import bcrypt from "bcrypt";
// Stand-alone async hashing function
export async function simpleHash(valueToHash) {
    const hashedValue = await bcrypt.hash(valueToHash, 10); // 10 = salt rounds
    console.log("hashed:", hashedValue);
    return hashedValue;
}
// Example usage when running this file directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
    // Take first command-line argument
    const value = process.argv[2] || "bbb";
    simpleHash(value);
}
//# sourceMappingURL=simpleHasher.js.map