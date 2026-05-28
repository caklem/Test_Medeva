const isAdmin = (req, res, next) => {
  if (!req.user.is_admin) {
    return res.status(403).json({
      message: "Akses admin saja",
    });
  }

  next();
};

module.exports = isAdmin;