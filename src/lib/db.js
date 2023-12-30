const mongoose = require("mongoose");
const { urlDb } = require("./config").default;

/* // Dont destructure URL_DB
// Since next will throw an error
if (!process.env.URL_DB) {
  throw new Error('URL_DB not configured');
} */

let cached = global.mongoose;

const PROMISESTATUS = {
  PENDING: "PENDING",
  FULFILLED: "FULFILLED",
  REJECTED: "REJECTED",
};

if (!cached) {
  const connInfo = {
    connection: null,
    promise: null,
    promiseStatus: PROMISESTATUS.PENDING,
  };
  cached = connInfo;
  global.mongoose = connInfo;
}

const initDb = async () => {
  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise || cached.promiseStatus === PROMISESTATUS.REJECTED) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(urlDb, opts)
      .then((conn) => {
        cached.promiseStatus = PROMISESTATUS.FULFILLED;
        return conn;
      })
      .catch((err) => {
        cached.promiseStatus = PROMISESTATUS.REJECTED;
        throw err;
      });
  }
  cached.connection = await cached.promise;
  return cached.connection;
};

export default initDb;
