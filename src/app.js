const session = require("express-session");
const passport = require("passport");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan"); 
require('./config/passport')(passport);
require('./config/passport-google')(passport);
const {globalLimiter} = require('./middleware/rateLimiter');

const swaggerSpecs = require('./config/swagger');
const appointmentRoutes = require('./routes/appointementRoutes'); 
const dbConnect = require("./config/database");
const swaggerUi = require("swagger-ui-express");
const errorHandler = require('./middleware/errorMiddleware');
dotenv.config();

const env = require('./config/env.config');

const app = express();
app.use(morgan('dev'));
app.use(express.json());


const port = env.PORT;

dbConnect();

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use(globalLimiter);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/prestataires", require("./routes/prestataireRoutes"));
app.use("/api/notifications",require("./routes/notificationRoutes"));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use('/v1', appointmentRoutes);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


app.get('/test-error', (req, res, next) => {
  try {
    throw new Error('Test error message');
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);