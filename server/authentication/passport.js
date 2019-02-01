var LocalStrategy = require('passport-local').Strategy;



module.exports = function(passport, Admin) {
    
    passport.use(new LocalStrategy(
        (username, password, done) => {
            Admin.findOne({ username: username }, function(err, user) {
            if (err) {  console.error("passport error: "+JSON.stringify(err)); return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            console.log("user: "+username);
            console.log("dbPassword: " + JSON.stringify(user));
            if (user["password"] === password) {
                return done(null, user);
            } else {
                console.log("Unequal passwords, rejecting")
                return done(null, false,  { message: 'Incorrect password.' });
            }
            
            });
        }
    ))
  
  passport.serializeUser((user, done) => {
  done(null, user._id)
  })
  
  passport.deserializeUser(function(username, done) {
    done(null, username)
  });

}