module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      return res.status(404).json({
        status: "fail",
        result: err,
      });
    });
  };
};
