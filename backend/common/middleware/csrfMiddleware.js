import csrf from 'csurf';

const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    },
    value: (req) => {
        return req.headers['x-csrf-token'];
    }
});

export default csrfProtection; 