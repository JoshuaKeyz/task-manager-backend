const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./utils/connectDB');
const AuthRoutes = require('./routes/auth.route.js');
const TaskRoutes = require('./routes/task.route');
const errorHandler = require('./middlewares/error-handler');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');


dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json())

app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent xss
app.use(xss())

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100

})

app.use(limiter)

app.use(hpp())

// enable cors
app.use(cors())

app.use('/api/v1/auth', AuthRoutes)
app.use('/api/v1/tasks', TaskRoutes);

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on localhost ${PORT}`);
})