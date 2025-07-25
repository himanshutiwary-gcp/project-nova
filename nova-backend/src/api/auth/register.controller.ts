import { Request, Response } from 'express';
import prisma from '../../config/prisma';

export const handleRegister = async (req: Request, res: Response) => {
    const { name, email, specialization, role, site } = req.body;

    if (!name || !email || !specialization || !role || !site) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    
    if (!email.endsWith('@google.com') && !email.endsWith('@cognizant.com')) {
        return res.status(403).json({ message: 'Registration is only for Google and Cognizant domains.' });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }

        // --- NEW, MORE ROBUST LOGIC ---
        // Prepare the data payload carefully
        const userData: {
            name: string;
            email: string;
            specialization: string;
            role: string;
            site: string;
            title?: string; // Title is optional
        } = {
            name,
            email,
            specialization,
            role,
            site,
        };

        // Only create the title if both parts are valid strings
        if (typeof role === 'string' && typeof specialization === 'string' && role && specialization) {
            userData.title = `${role} - ${specialization}`;
        }
        // --------------------------------

        // Create the new user with the prepared data
        await prisma.user.create({
            data: userData,
        });

        res.status(201).json({ message: 'Registration successful! You can now log in.' });

    } catch (error) {
        // Log the actual error for better debugging in Cloud Run Logs
        console.error("REGISTRATION_ERROR:", error); 
        res.status(500).json({ message: 'Server error during registration.' });
    }
};
