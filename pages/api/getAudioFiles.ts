// src/pages/api/getAudioFiles.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { era, movie } = req.query;

    if (!era || !movie) {
        return res.status(400).json({ error: 'Era and movie are required' });
    }

    const sanitizedTitle = (movie as string).replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, "_");
    const directoryPath = path.join(process.cwd(), 'public', 'music', era as string, sanitizedTitle);

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Directory does not exist
                return res.status(404).json({ error: 'Directory not found' });
            }
            // Other errors
            return res.status(500).json({ error: 'Failed to read directory' });
        }

        const audioFiles = files.filter(file => file.endsWith('.mp3'));
        res.status(200).json({ files: audioFiles });
    });
}