// utils/helpers.ts

import { UniqueIdentifier } from '@dnd-kit/core';
import { Movie } from '@/public/data/movies';

export const shuffleArray = (array: any[]) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
};

export const isCorrectOrder = (droppedItems: { id: UniqueIdentifier; droppableId: UniqueIdentifier }[], movies: Movie[]) => {
    const sortedMovies = [...movies].sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
    return droppedItems.every((item, index) => {
        const movieIndex = parseInt(item.id.toString().replace('draggable-', ''), 10);
        return sortedMovies[index].title === movies[movieIndex].title;
    });
};