import express from "express";
import os from "os";
import cluster from "cluster";

const totalCpus = os.cpus().length;

const port = 3000;

if (cluster.isPrimary) {
  console.log(`Number of CPU's is ${totalCpus}`)
  console.log(`Primary ${process.pid} is running`)

  // fork workers
  for (let i = 0; i < totalCpus; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`)
    console.log("Let fork another worker!!!")
    cluster.fork();
  })
} else {
  const app = express();
  console.log(`Worker ${process.pid} started`)

  app.get('/', (req, res) => {
    res.send('Hello world')
  })

  app.get('/pid', (req, res) => {
    res.send('Hello world' + process.pid)
  })

  app.get('/api/:n', function(req, res) {
    let n = parseInt(req.params.n);
    let count = 0;

    if (n > 50000000000) n = 50000000000;

    for (let i = 0; i <= n; i++) {
      count += 1;
    }

    res.send(`Final count ${count} ${process.pid}`)
  });

  app.listen(port, () => {
    console.log(`App is running on ${port}`)
  })
}