const baseWords = [
    'apple',
    'tensor',
    'flask',
    'pypy',
    'redux',
    'map',
    'void',
    'git',
    'unity'
];

function getRandomPhrase(phrases) {
    const randomIndex = Math.floor(Math.random() * phrases.length);
    return phrases[randomIndex];
}

export function generateRandomPhrase() {
    let concatenatedString = '';
    const numberOfPhrases = 2;
    for (let i = 0; i < numberOfPhrases; i++) {
        concatenatedString += getRandomPhrase(baseWords);
    }

    return concatenatedString.trim();
}