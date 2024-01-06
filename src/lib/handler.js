import nc from "next-connect";
import Joi from "joi";
import { Response, RESPONSE_MESSAGE, RESPONSE_STATUS } from "../appConstants";
// import logger from "../logger";

const sanitize = (v) => {
  if (v instanceof Object) {
    for (let i = 0; i < Object.keys(v).length; i += 1) {
      const key = Object.keys(v)[i];
      if (/^\$/.test(key)) {
        delete v[key];
      } else {
        sanitize(v[key]);
      }
    }
  }
  return v;
};

export default (
  { withoutDb, dontSanitize } = { withoutDb: false, dontSanitize: false }
) => {
  const handler = nc({
    attachParams: true,
    onError: (err, req, res) => {
      res.status(RESPONSE_STATUS.ERROR);
      return res.json(new Response(RESPONSE_STATUS.ERROR, err.message, err));
    },
    onNoMatch: (req, res) => {
      res.status(RESPONSE_STATUS.NOTFOUND);
      return res.json(
        new Response(RESPONSE_STATUS.NOTFOUND, "Page not found", {})
      );
    },
  })
    .use((req, res, next) => {
      res.sendPromise = (promise) => {
        promise
          .then((/* result */) => {
            res.send(
              new Response(RESPONSE_STATUS.OK, RESPONSE_MESSAGE.OK, {
                status: "OK",
              })
            );
          })
          .catch((err) => {
            // logger.error("Service Error");
            // logger.error(err);
            res.status(RESPONSE_STATUS.ERROR);
            res.send(new Response(RESPONSE_STATUS.ERROR, err.message, err));
          });
      };
      return next();
    })
    .use(async (req, res, next) => {
      req.validate = (
        data = {},
        schema = Joi.any(),
        validationOpts = { convert: true }
      ) => {
        if (!Joi.isSchema(schema)) {
          throw new Error("Invalid schema");
        }
        const { value, error } = schema.validate(data, validationOpts);
        if (error) {
          throw new Error(error.message);
        }
        return value;
      };

      await next();
    });

  if (!dontSanitize) {
    handler.use(async (req, res, next) => {
      sanitize(req.body);
      sanitize(req.query);
      next();
    });
  }

  if (!withoutDb) {
    handler.use(async (req, res, next) => {
      next();
    });
  }

  return handler;
};
