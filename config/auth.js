// expose our config directly to our application using module.exports
module.exports = {
    //developers.facebook.com
    'facebookAuth': {
        'clientID': '1675914896001421',
        'clientSecret': '7fe0217711792f908161a1efb4711842',
        'callbackURL': 'http://localhost:8080/auth/facebook/callback'
    },
    'facebookAuthMine': {
        'clientID': '1737387653175627',
        'clientSecret': '162292da511ee8f9c5c2daab4936b965',
        'callbackURL': 'http://localhost:8080/auth/facebook/callback'
    },
    //dev.twitter.com
    'twitterAuth': {
        'consumerKey': 'CJWOXklHh2iJLdX8OeXBatd7G',
        'consumerSecret': 'ZdoOupziT1PIJykk6iPLMM3ud8yBlgg3Wxp7GVMU4UAMvHKqU3',
        'callbackURL': 'http://localhost:8080/auth/twitter/callback'
    },
    'twitterAuthMine': {
        'consumerKey': 'MJqnNZt4Y8XSvsuXPbihT328Q',
        'consumerSecret': 'I9ahxEbdZR3GFkBZRH6uH85DnetJRqGfGxHha5F9FadGUhhBVO',
        'callbackURL': 'http://localhost:8080/auth/twitter/callback'
    },
    //console.developer.google.com
    'googleAuth': {
        'clientID': '87668141240-tiqv5uie7i0oe8nq2tlrr10qu6jkd1pa.apps.googleusercontent.com',
        'clientSecret': 'r8wDnKBQfnAP9LvmZG4cJQ87',
        'callbackURL': 'http://localhost:8080/auth/google/callback'
    },
    'googleAuthMine': {
        'clientID': '553452173811-4kd2so40afsga7uaf03j5g1hcd21j56g.apps.googleusercontent.com',
        'clientSecret': 'HXtfkvs5UrNjYgkWfwRtCe6F',
        'callbackURL': 'http://localhost:8080/auth/google/callback'
    },
};
