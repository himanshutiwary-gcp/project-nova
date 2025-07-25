import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma';

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: '30d',
    });
};

export const handleGoogleLogin = async (req: Request, res: Response) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.VITE_GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email || !payload.name) {
            return res.status(400).json({ message: 'Invalid Google token' });
        }

        const { email, name, picture } = payload;

        // --- THIS IS THE KEY CHANGE ---
        // Find the user by email
        let user = await prisma.user.findUnique({ where: { email } });

        // If user does not exist in our database, reject the login
        if (!user) {
            return res.status(403).json({ message: "Account not found. Please register first." });
        }

        // If user exists, update their name and picture from Google, but keep their registered details
        user = await prisma.user.update({
            where: { email },
            data: {
                name,
                pictureUrl: picture,
            },
        });
        // -----------------------------

        const jwtToken = generateToken(user.id);

        // Return all user data
        res.status(200).json({ ...user, token: jwtToken });

    } catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({ message: 'Server error during authentication' });
    }
};
