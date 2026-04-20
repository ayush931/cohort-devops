import type { Request, Response, NextFunction } from "express";
import express from "express";
import client from "prom-client";

const app = express();

// create a counter-metrics
const requestCounter = new client.Counter({
  name: "http_request_total",
  help: "Total number of HTTP request",
  labelNames: ["method", "route", "status_code"]
})

const activeRequestGauge = new client.Gauge({
  name: "active_requests",
  help: "Number of active requests"
})

const httpRequestDurationMilliseconds = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP request in ms",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000]  // build your own custom brackets
})

const requestCountMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.path !== "/metrics") {
    activeRequestGauge.inc();
  }
  const startTime = Date.now();

  res.on("finish", () => {
    const endTime = Date.now();
    console.log(`Request took ${endTime - startTime} ms`)

    // increment request counter
    requestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status_code: req.statusCode
    })

    if (req.path !== "/metrics") {
      activeRequestGauge.dec();
    }

    httpRequestDurationMilliseconds.observe({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status_code: res.statusCode
    }, endTime - startTime)
  })
  next()
}

app.use(requestCountMiddleware)

app.get("/cpu", async (req, res) => {
  await new Promise(s => setTimeout(s, Math.random() * 1000))

  return res.json({
    message: "cpu"
  })
})

app.get("/users", (req, res) => {
  return res.json({
    message: "user"
  })
})

app.get("/metrics", async (req, res) => {
  const metrics = await client.register.metrics();
  console.log(client.register.contentType);
  res.set("Content-Type", client.register.contentType);
  res.end(metrics);
})

app.listen(5000, () => {
  console.log('App is running on 5000')
})