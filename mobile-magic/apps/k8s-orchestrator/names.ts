
export const NAMES = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", "kiwi", "lemon", "mango", "orange", "pear", "quince", "raspberry", "strawberry", "tangerine", "ugli", "vanilla", "watermelon", "xigua", "yuzu", "zucchini", "zebra", "lion", "cheetah", "dog", "cat", "bird", "fish", "snake", "tiger", "elephant", "giraffe", "zebra", "lion", "cheetah", "nyc", "sf", "seattle", "mountainview", "texas"];

export function getRandomName() {
    const name1 = NAMES[Math.floor(Math.random() * NAMES.length)];
    const name2 = NAMES[Math.floor(Math.random() * NAMES.length)];
    const name3 = NAMES[Math.floor(Math.random() * NAMES.length)];

    return `${name1}-${name2}-${name3}`;
}
