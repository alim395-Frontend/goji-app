// pages/api/updateMoviesData.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchAllGodzillaMovies } from '../../server/updateMoviesData';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        try {
            await fetchAllGodzillaMovies();
            res.status(200).json({ message: 'Movies data has been updated.' });
        } catch (error) {
            console.error('Error running updateMoviesData script:', error);
            res.status(500).json({ message: 'Error updating movies data.' });
        }
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}