var fs = require('fs'),
    hogan = require("hogan");

module.exports = {
  buildConfigs : function(next) {
    fs.readFile('./komodoo-discourse.yml', 'utf8', function (err,data) {
      if(err) { return next(false); }

      trusted = hogan.compile(data).render(process.env);
      fs.writeFile('./komodoo-discourse.yml.trusted', trusted, function(err){
        if(err) { return next(false); }
      });

      return next(true);
    });
  }
}
