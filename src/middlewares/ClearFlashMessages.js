export default (req,res,next) => {
    next();
    if(req.method == 'GET'){
      req.session.error = null;
      req.session.message = null;
      req.session.save();
    }
}