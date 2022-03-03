function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
      next()
    } else {
      res.redirect('/login')
    }
  }

export default isAuth
