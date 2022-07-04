const ironOptions = {
    cookieName: 'siwe',
    password: process.env.IRON_PASSWORD,
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
}

export default ironOptions