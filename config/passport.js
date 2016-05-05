//Loading Strategies
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// load up the user model
var User = require('../app/models/user');
// load the auth config
var configAuth = require('./auth');

//Starting module
module.exports = function(passport) {

    // used to serialize the user for the session **REQUIRED
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user **REQUIRED
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    //Setting up local signup on passport
    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(request, email, password, done) {
            if (email) {
                email = email.toLowerCase();
            }
            process.nextTick(function() {
                if (!request.user) {
                    User.findOne({
                        'local.email': email
                    }, function(err, user) {
                        if (err) return done(err);
                        else if (!user || !user.validPassword(password))
                            return done(null, false, request.flash('loginMessage', 'User/password is not correct.'));
                        else return done(null, user);
                    });
                } else return done(null, request.user);
            });
        }));
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will
            // override with email
            usernameField: 'email',
            passwordField: 'password',
            // allows us to pass in the req from our route (lets us check if a user
            // is logged in or not)
            passReqToCallback: true
        },
        function(request, email, password, done) {
            if (email) {
                // Use lower-case e-mails to avoid case-sensitive e-mail matching
                email = email.toLowerCase();
            }
            // asynchronous
            process.nextTick(function() {
                // if the user is not already logged in:
                if (!request.user) {
                    User.findOne({
                        'local.email': email
                    }, function(err, user) {
                        // if there are any errors, return the error
                        if (err) return done(err);
                        // check to see if theres already a user with that email
                        if (user) return done(null, false, request.flash('signupMessage', 'That email is already taken.'));
                        else {
                            // create the user
                            var newUser = new User();
                            newUser.local.email = email;
                            newUser.local.password = newUser.generateHash(password);
                            newUser.save(function(err) {
                                if (err) return done(err);
                                return done(null, newUser);
                            });
                        }
                    });
                } else if (!request.user.local.email) {
                    //let's check if the email used to connect a local account is being used by another user
                    User.findOne({
                        'local.email': email
                    }, function(err, user) {
                        if (err) return done(err);

                        if (user) {
                            // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                            return done(null, false, request.flash('loginMessage', 'That email is already taken.'));
                        } else {
                            var user = request.user;
                            user.local.email = email;
                            user.local.password = user.generateHash(password);
                            user.save(function(err) {
                                if (err) return done(err);
                                return done(null, user);
                            });
                        }
                    });
                }
                // if the user is logged in but has no local account...
                else {
                    // user is logged in and already has a local account. Ignore signup.
                    // (You should log out before trying to create a new account, user!)
                    return done(null, request.user);
                }
            });
        }));

    //facebook
    passport.use(new FacebookStrategy({
            clientID: configAuth.facebookAuthMine.clientID,
            clientSecret: configAuth.facebookAuthMine.clientSecret,
            callbackURL: configAuth.facebookAuthMine.callbackURL,
            profileFields: ['id', 'name', 'email'],
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(request, token, refreshToken, profile, done) {
          handleUser(request, token, refreshToken, profile, done, {
              'facebook.id': profile.id
            }, function(user, profile, token) {
                var changed = !user.facebook.token
                user.facebook.id = profile.id;
                user.facebook.token = token;
                user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email = (profile.emails[0].value || '').toLowerCase();
                return changed;
            });
        }));


    //twitter
    passport.use(new TwitterStrategy({
            consumerKey: configAuth.twitterAuthMine.consumerKey,
            consumerSecret: configAuth.twitterAuthMine.consumerSecret,
            callbackURL: configAuth.twitterAuthMine.callbackURL,
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(request, token, tokenSecret, profile, done) {
            handleUser(request, token, null, profile, done, {
              'twitter.id': profile.id
            }, function(user, profile, token) {
                var changed = !user.twitter.token
                user.twitter.id = profile.id;
                user.twitter.token = token;
                user.twitter.username = profile.username;
                user.twitter.displayName = profile.displayName;
                return changed;
            });
        }));

    //Google
    passport.use(new GoogleStrategy({
            clientID: configAuth.googleAuthMine.clientID,
            clientSecret: configAuth.googleAuthMine.clientSecret,
            callbackURL: configAuth.googleAuthMine.callbackURL,
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(request, token, refreshToken, profile, done) {
            handleUser(request, token, refreshToken, profile, done, {
                'google.id': profile.id
            }, function(user, profile, token) {
                var changed = !user.google.token
                user.google.id = profile.id;
                user.google.token = token;
                user.google.name = profile.displayName;
                user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email
                return changed;
            });
        }));

    //close module.exports
};

var handleUser = function(request, token, refreshToken, profile, done, criteria, assign_fn) {
    // asynchronous
    process.nextTick(function() {
        // check if the user is already logged in
        if (!request.user) {
            User.findOne(criteria, function(err, user) {
                if (err) return done(err);
                else if (user) {
                    if (assign_fn(user, profile, token)) {
                        user.save(function(err) {
                            if (err) return done(err);
                            return done(null, user);
                        });
                    }
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user, create them
                    var newUser = new User();
                    assign_fn(newUser, profile, token);
                    newUser.save(function(err) {
                        if (err) return done(err);
                        return done(null, newUser);
                    });
                }
            });
        } else {
            // user already exists and is logged in, we have to link accounts
            var user = request.user; // pull the user out of the session
            assign_fn(user, profile, token);
            user.save(function(err) {
                if (err) return done(err);
                return done(null, user);
            });
        }
    });
}
