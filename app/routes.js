var express = require('express');
var appRouter = express.Router();
var authRouter = express.Router();
var connectRouter = express.Router();
var unlinkRouter = express.Router();

module.exports = function(app, passport) {
    // normal Routes

    // index
    appRouter.get('/', function(request, response) {
        response.render('index.ejs');
    });

    // signup
    appRouter.get('/signup', function(request, response) {
        response.render('signup.ejs', {
            message: request.flash('signupMessage')
        });
    });
    appRouter.post('/signup', passport.authenticate('local-signup', {
        // redirect to the secure profile section
        successRedirect: '/profile',
        // redirect back to the signup page if there is an error
        failureRedirect: '/signup',
        // allow flash messages
        failureFlash: true
    }));

    // login/logout
    appRouter.get('/login', function(request, response) {
        response.render('login.ejs', {
            message: request.flash('loginMessage')
        });
    });
    appRouter.post('/login', passport.authenticate('local-login', {
        // redirect to the secure profile section
        successRedirect: '/profile',
        // redirect back to the login page if there is an error
        failureRedirect: '/login',
        // allow flash messages
        failureFlash: true
    }));
    appRouter.get('/logout', function(request, response) {
        request.logout();
        response.redirect('/');
    });
    appRouter.get('/destroy', function(request, response) {
        request.user.remove(function(err) {
            if (err) return;
            request.logout();
            response.redirect('/');
        });
    });

    //Profile
    appRouter.get('/profile', isLoggedIn, function(request, response) {
        response.render('profile.ejs', {
            user: request.user
        });
    });

    app.use('/', appRouter);

    appendAuthRoute(passport, 'facebook', 'email');
    appendAuthRoute(passport, 'google');
    appendAuthRoute(passport, 'twitter');

    //Set app to use authRouter for /auth/* requests
    app.use('/auth', authRouter);


    //local
    connectRouter.get('/local', function(request, response) {
        response.render('connect-local.ejs', {
            message: request.flash('loginMessage')
        });
    });
    connectRouter.post('/local', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.use('/connect', connectRouter);

    //local
    unlinkRouter.get('/local', function(request, response) {
        var user = request.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            response.redirect('/profile');
        });
    });

    app.use('/unlink', unlinkRouter);
};

// middleware that will verify whether user is logged in. It will be added
// outside module.exports
var isLoggedIn = function(request, response, next) {
    if (request.isAuthenticated()) return next();
    response.redirect('/');
}

var appendAuthRoute = function(passport, id, scope, logout_fn) {
    authRouter.get('/' + id, passport.authenticate(id, {
        scope: scope||['profile', 'email']
    }));
    authRouter.get('/' + id + '/callback', passport.authenticate(id, {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));

    connectRouter.get('/' + id, passport.authorize(id, {
        scope: 'email'
    }));
    connectRouter.get('/' + id + '/callback',
        passport.authorize(id, {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    unlinkRouter.get('/' + id, function(request, response) {
        var user = request.user;
        user[id].token = undefined;
        user.save(function(err) {
            response.redirect('/profile');
        });
    });
}
