const target = 1_000_000_000_0;

let ans = 0;
let startTime = Date.now();

for (let i = 0; i <= target; i++) {
  ans += i
}

const endTime = Date.now();

console.log(`Total time is ${endTime - startTime}`);
console.log(ans);