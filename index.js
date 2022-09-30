require('dotenv').config();
require('express-async-errors');

// Middlewares
const {
  authenticationMiddleware,
  errorHandlerMiddleware,
  notFoundMiddleware,
} = require('./src/middlewares');

// Routes
const { basicRoutes, authenticatedRoutes } = require('./src/routes');

// Application
const app = require('./app');

app.get('/', (req, res) => {
  res.send('<h1>Welcome to CRM Server</h1><p>Developed by Diego Salas</p>');
});

app.use(basicRoutes);
app.use(authenticationMiddleware);
app.use(authenticatedRoutes);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
