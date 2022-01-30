const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

dotenv.config({ path: './config.env' });

const app = require('./app');

let DB = '';

if (process.env.NODE_ENV === 'development') {
  DB = process.env.DATABASE_LOCAL;
} else if (process.env.NODE_ENV === 'production') {
  DB = process.env.DATABASE_LOCAL;
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB);

    console.log(
      `Database connected on: ${conn.connection.host} ✔️✔️✔️`.white.bgGreen
    );
  } catch (err) {
    console.log(`Error: ${err.message} ❌❌❌`.red);
    process.exit(1);
  }
};

connectDB();

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`App connected on port: ${port}`.cyan);
});
