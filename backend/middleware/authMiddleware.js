import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from the "Bearer <token>" header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using your secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by the ID in the token and attach it to the request
            // We exclude the password from the user object
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Move on to the next function
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export { protect };