// Placeholder for admin-specific middleware (if separate behavior needed)
module.exports = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Admin resource. Access denied.');
  }
};
