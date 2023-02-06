export default (req,res,next)=>{
    let env = req.app.settings.nunjucksEnv;
    env.addGlobal('message', req.session.message);
    env.addGlobal('error', req.session.error);
    env.addGlobal('req', req);
    env.addGlobal('res', res);
    next();
}