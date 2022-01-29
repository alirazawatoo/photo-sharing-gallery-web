const latency = Number(process.env.LATENCY_MS)

module.exports = {
  port: Number(process.env.API_PORT) || 8888,
  // The exercise simulates a slow API; tests and screenshots turn it down.
  latencyMs: Number.isFinite(latency) && latency >= 0 ? latency : 3000,
}
