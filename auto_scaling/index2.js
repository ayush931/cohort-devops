import cluster from 'cluster';
import os from 'os';

const numCpus = os.cpus().length;
const target = 1_000_000_000_0;   // 1 Billion
const chunkSize = Math.floor(target / numCpus);

if (cluster.isPrimary) {
  let startTime = Date.now();
  let totalSum = 0;
  let completedWorkers = 0

  for (let i = 0; i < numCpus; i++) {
    const workers = cluster.fork();
    const start = i * chunkSize;
    const end = (i == numCpus - 1) ? target : (i + 1) * chunkSize - 1;

    setTimeout(() => {
      workers.send({ start, end });
    }, 100)


    workers.on('message', (msg) => {
      totalSum += Number(msg.partialSum);
      completedWorkers++;

      if (completedWorkers == numCpus) {
        let endTime = Date.now();
        console.log(`Total sum: ${totalSum}`)
        console.log(`Total time taken = ${endTime - startTime}`)
        process.exit();
      }
    })
  }
}
else {
  process.on('message', (msg) => {
    const { start, end } = msg;
    let partialSum = 0;

    for (let i = start; i <= end; i++) {
      partialSum += i;
    }

    process.send({ partialSum: partialSum.toString() })
  })
}

// 50000000000090915000
// 50000000000067860000