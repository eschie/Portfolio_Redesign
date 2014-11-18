module.exports = function (app) {
    app.get('/', require("../controllers/index"));
    // app.get('/work', require("../controllers/work"));
    // app.get('/portfolio', require("../controllers/portfolio"));
    // app.get('/projects', require("../controllers/projects"));
    // app.get('/contact', require("../controllers/contact"));
}