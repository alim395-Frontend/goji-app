const fs = require('fs');
const path = require('path');

// Base music directory
const musicDir = path.join(__dirname, 'public', 'music');

// Function to sanitize movie titles
const sanitizeTitle = (title) => title.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, "_");

// Function to list all folders
const listMusicFolders = (dir) => {
    const eras = fs.readdirSync(dir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    const folders = eras.flatMap(era => {
        const eraPath = path.join(dir, era);
        const movies = fs.readdirSync(eraPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        return movies.map(movie => path.join(eraPath, movie));
    });

    return folders;
};

// Execute the function and log the results
const folders = listMusicFolders(musicDir);
console.log('Music Folders:', folders);