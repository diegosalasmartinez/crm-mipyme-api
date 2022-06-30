require("dotenv").config()
require("express-async-errors")

// Server configuration
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const helmet = require("helmet")
const xss = require("xss-clean")
const rateLimit = require("express-rate-limit")

// Routes
const { authRoutes, usuarioRoutes, productoRoutes } = require("./src/routes")

// Middlewares
const {
  authenticationMiddleware,
  errorHandlerMiddleware,
  notFoundMiddleware
} = require("./src/middleware")

const app = express()
app.set("trust proxy", 1)
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }))
app.use(express.json())
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())
app.use(cors())
app.use(xss())

app.get("/", (req, res) => {
  res.send("<h1>Welcome to CRM Server</h1><p>Developed by Diego Salas</p>")
})

const baseUrl = "/api/v1"
app.use(baseUrl + '/auth', authRoutes);
// app.use(authenticationMiddleware);
app.use(baseUrl + "/usuarios", usuarioRoutes)
app.use(baseUrl + "/productos", productoRoutes)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})
