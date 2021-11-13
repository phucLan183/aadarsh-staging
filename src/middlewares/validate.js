const validation = (schema) => async (req, res, next) => {
  try {
    const request = {
      body: req.body,
      query: req.query,
      params: req.params
    }
    await schema.validate(request)
    next();
  } catch (error) {
    return res.status(400).json({
      status: 'false',
      message: error.message,
    })
  }
}

module.exports = validation