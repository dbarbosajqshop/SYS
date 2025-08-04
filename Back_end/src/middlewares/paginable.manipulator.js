async function paginable(req, res, next) {
  try {
    if (!req.result) return next();

    let { limit = 10, page = 1 } = req.query;

    limit = parseInt(limit, 10);
    page = parseInt(page, 10);

    const { result } = req;

    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / limit);

    const paginableResult = result.slice((page - 1) * limit, page * limit);
    const response = {
      data: paginableResult,
      totalItems,
      totalPages,
      currentPage: page,
      limit,
    };

    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}

export default paginable;
