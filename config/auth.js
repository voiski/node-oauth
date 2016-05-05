// expose our config directly to our application using module.exports
module.exports = {
    //developers.facebook.com
    'facebookAuth': {
        'clientID': '1675914896001421',
        'clientSecret': '7fe0217711792f908161a1efb4711842',
        'callbackURL': 'http://localhost:8080/auth/facebook/callback',
        'profileFields': ['id', 'name', 'email'],
        'scope': 'email'
    },
    'facebookAuthMine': {
        'clientID': '1737387653175627',
        'clientSecret': '162292da511ee8f9c5c2daab4936b965',
        'callbackURL': 'http://localhost:8080/auth/facebook/callback',
        'profileFields': ['id', 'name', 'email'],
        'scope': 'email'
    },
    //dev.twitter.com
    'twitterAuth': {
        'consumerKey': 'CJWOXklHh2iJLdX8OeXBatd7G',
        'consumerSecret': 'ZdoOupziT1PIJykk6iPLMM3ud8yBlgg3Wxp7GVMU4UAMvHKqU3',
        'callbackURL': 'http://localhost:8080/auth/twitter/callback',
        'scope': ['profile', 'email']
    },
    'twitterAuthMine': {
        'consumerKey': 'MJqnNZt4Y8XSvsuXPbihT328Q',
        'consumerSecret': 'I9ahxEbdZR3GFkBZRH6uH85DnetJRqGfGxHha5F9FadGUhhBVO',
        'callbackURL': 'http://localhost:8080/auth/twitter/callback',
        'scope': ['profile', 'email']
    },
    //console.developer.google.com
    'googleAuth': {
        'clientID': '87668141240-tiqv5uie7i0oe8nq2tlrr10qu6jkd1pa.apps.googleusercontent.com',
        'clientSecret': 'r8wDnKBQfnAP9LvmZG4cJQ87',
        'callbackURL': 'http://localhost:8080/auth/google/callback',
        'scope': ['profile', 'email']
    },
    'googleAuthMine': {
        'clientID': '553452173811-4kd2so40afsga7uaf03j5g1hcd21j56g.apps.googleusercontent.com',
        'clientSecret': 'HXtfkvs5UrNjYgkWfwRtCe6F',
        'callbackURL': 'http://localhost:8080/auth/google/callback',
        'scope': ['profile', 'email']
    },
    //developer.github.com
    'githubAuth': {
        'clientID': '3f2af802e11623981486',
        'clientSecret': '7ae01c9421a7138bb83f57b0b1b7aa1080d3c2b4',
        'callbackURL': 'http://localhost:8080/auth/github/callback',
        'scope': ['profile', 'email']
    },
    //developer.linkedin.com
    'linkedinAuth': {
        'clientID': '77m0soh54qrkor',
        'clientSecret': 'XXnsrnkWQYolHndp',
        'callbackURL': 'http://localhost:8080/auth/linkedin/callback',
        'scope': ['r_emailaddress', 'r_basicprofile']
    }
};
