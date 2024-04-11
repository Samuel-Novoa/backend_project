const responseHandler = (handlerFunction) => {
  return async (req, res, next) => {
    try {
      const data = await handlerFunction(req, res);
      if (res.headersSent) {
        return;
      }
      let statusCode = data.statusCode || 200;
      const httpStatusCode = data.httpStatusCode || 200;
      const responseData = data.data || null;

      if (statusCode === undefined) {
        statusCode = httpStatusCode;
      }

      res
        .status(statusCode)
        .json({ statusCode, httpStatusCode, ...responseData });
    } catch (error) {
      if (!res.headersSent) {
        const code = error.code || 500;
        const status = error.status || "Error";
        const data =
          error.data ||
          JSON.stringify(error, Object.getOwnPropertyNames(error));
        res.status(code).json({ code, status, data });
      }
    }
  };
};

export default responseHandler;
