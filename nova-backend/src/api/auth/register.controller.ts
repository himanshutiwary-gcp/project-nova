import { Request, Response } from 'express';
import prisma from '../../config/prisma';

export const handleRegister = async (req: Request, res: Response) => {
    const { name, email, specialization, role, site } = req.body;

    // Basic validation
    if (!name || !email || !specialization || !role || !site) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Authorization check for allowed domains
    if (!email.endsWith('@google.com') && !email.endsWith('@cognizant.com')) {
        return res.status(403).json({ message: 'Registration is only allowed for Google and Cognizant domains.' });
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }

        // Create the new user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                specialization,
                role,
                site,
                // Combine role and specialization for a clean title
                title: `${role} - ${specialization}`
            },
        });

        res.status(201).json({ message: 'Registration successful! You can now log in.' });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};
