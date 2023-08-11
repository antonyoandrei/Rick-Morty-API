"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
var Status;
(function (Status) {
    Status["Alive"] = "Alive";
    Status["Dead"] = "Dead";
    Status["Unknown"] = "unknown";
})(Status || (Status = {}));
var Gender;
(function (Gender) {
    Gender["Male"] = "Male";
    Gender["Female"] = "Female";
    Gender["Unknown"] = "unknown";
    Gender["Genderless"] = "Genderless";
})(Gender || (Gender = {}));
const API_URL = 'https://rickandmortyapi.com/api';
let page = 1;
function fetchLocation(locationUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(locationUrl);
            const location = yield response.json();
            const episodeDetailsContainer = document.getElementById('episodeDetailsContainer');
            if (episodeDetailsContainer) {
                episodeDetailsContainer.replaceChildren();
                const locationDetails = document.createElement('div');
                locationDetails.classList.add('mb-3', 'mt-3');
                const locationName = document.createElement('h2');
                locationName.textContent = location.name;
                locationDetails.appendChild(locationName);
                const locationTypeParagraph = document.createElement('p');
                locationTypeParagraph.textContent = `Type: ${location.type}`;
                locationDetails.appendChild(locationTypeParagraph);
                const residentsTitle = document.createElement('p');
                residentsTitle.textContent = 'Residents:';
                residentsTitle.classList.add('text-decoration-underline');
                locationDetails.appendChild(residentsTitle);
                const residentsList = document.createElement('div');
                residentsList.classList.add('row', 'row-cols-1', 'row-cols-md-2', 'row-cols-lg-4');
                for (const residentUrl of location.residents) {
                    const residentResponse = yield fetch(residentUrl);
                    const residentCharacter = yield residentResponse.json();
                    const residentCard = createCharacterCard(residentCharacter);
                    const residentCol = document.createElement('div');
                    residentCol.classList.add('col');
                    residentCol.appendChild(residentCard);
                    residentsList.appendChild(residentCol);
                }
                locationDetails.appendChild(residentsList);
                episodeDetailsContainer.appendChild(locationDetails);
            }
        }
        catch (error) {
            console.error('Error fetching location:', error);
        }
    });
}
function createEpisodeElement(episode) {
    const episodeItem = document.createElement('a');
    episodeItem.href = '#';
    episodeItem.classList.add('list-group-item', 'list-group-item-action');
    episodeItem.textContent = `${episode.episode}: ${episode.name} `;
    episodeItem.addEventListener('click', () => {
        fetchCharacters(episode);
    });
    return episodeItem;
}
function showLoadMoreButton(show) {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    loadMoreBtn.classList.toggle('d-none', !show);
}
function fetchEpisodes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${API_URL}/episode?page=${page}`);
            const data = yield response.json();
            const episodes = data.results;
            const episodeList = document.getElementById('episodeList');
            episodes.forEach((episode) => {
                const episodeItem = createEpisodeElement(episode);
                episodeList === null || episodeList === void 0 ? void 0 : episodeList.appendChild(episodeItem);
            });
            showLoadMoreButton(!!data.info.next);
        }
        catch (error) {
            console.error('Error fetching episodes:', error);
        }
    });
}
(_a = document.getElementById('loadMoreBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    page++;
    fetchEpisodes();
});
function createCharacterCard(character) {
    const characterCard = document.createElement('div');
    characterCard.classList.add('card', 'mb-3');
    characterCard.style.width = '12rem';
    characterCard.style.height = '25rem';
    const cardImage = document.createElement('img');
    cardImage.src = character.image;
    cardImage.classList.add('card-img-top');
    cardImage.alt = character.name;
    characterCard.appendChild(cardImage);
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = character.name;
    cardBody.appendChild(cardTitle);
    const statusParagraph = document.createElement('p');
    statusParagraph.classList.add('card-text');
    statusParagraph.textContent = `Status: ${character.status}`;
    cardBody.appendChild(statusParagraph);
    const speciesParagraph = document.createElement('p');
    speciesParagraph.classList.add('card-text');
    speciesParagraph.textContent = `Species: ${character.species}`;
    cardBody.appendChild(speciesParagraph);
    const genderParagraph = document.createElement('p');
    genderParagraph.classList.add('card-text');
    genderParagraph.textContent = `Gender: ${character.gender}`;
    cardBody.appendChild(genderParagraph);
    const originParagraph = document.createElement('p');
    originParagraph.classList.add('card-text');
    originParagraph.textContent = `Origin: ${character.origin.name}`;
    cardBody.appendChild(originParagraph);
    characterCard.appendChild(cardBody);
    characterCard.addEventListener('click', () => {
        openCharacterModal(character);
    });
    return characterCard;
}
function fetchCharacters(episode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const charactersUrls = episode.characters;
            const characters = [];
            for (const characterUrl of charactersUrls) {
                const response = yield fetch(characterUrl);
                const character = yield response.json();
                characters.push(character);
            }
            const episodeDetailsContainer = document.getElementById('episodeDetailsContainer');
            if (episodeDetailsContainer) {
                episodeDetailsContainer.replaceChildren();
                const episodeDetails = document.createElement('div');
                episodeDetails.classList.add('mb-3', 'mt-3');
                const episodeName = document.createElement('h2');
                episodeName.textContent = episode.name;
                episodeDetails.appendChild(episodeName);
                const airDateParagraph = document.createElement('p');
                airDateParagraph.textContent = `Air Date: ${episode.air_date}`;
                episodeDetails.appendChild(airDateParagraph);
                const episodeNumberParagraph = document.createElement('p');
                episodeNumberParagraph.textContent = `Episode: ${episode.episode}`;
                episodeDetails.appendChild(episodeNumberParagraph);
                episodeDetailsContainer.appendChild(episodeDetails);
                const characterRow = document.createElement('div');
                characterRow.classList.add('row', 'row-cols-1', 'row-cols-md-2', 'row-cols-lg-4');
                episodeDetailsContainer.appendChild(characterRow);
                characters.forEach((character) => {
                    const characterCard = createCharacterCard(character);
                    const characterCol = document.createElement('div');
                    characterCol.classList.add('col');
                    characterCol.appendChild(characterCard);
                    characterRow.appendChild(characterCol);
                });
            }
        }
        catch (error) {
            console.error('Error fetching characters:', error);
        }
    });
}
function openCharacterModal(character) {
    return __awaiter(this, void 0, void 0, function* () {
        const characterModal = new bootstrap.Modal(document.getElementById('characterModal'));
        const modalBody = document.getElementById('characterModalBody');
        modalBody.replaceChildren();
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-info');
        const characterImage = document.createElement('img');
        characterImage.src = character.image;
        characterImage.alt = character.name;
        characterImage.classList.add('img-fluid', 'mb-3');
        modalContent.appendChild(characterImage);
        const characterName = document.createElement('h5');
        characterName.classList.add('mb-2');
        characterName.textContent = character.name;
        modalContent.appendChild(characterName);
        const statusParagraph = document.createElement('p');
        statusParagraph.textContent = `Status: ${character.status}`;
        modalContent.appendChild(statusParagraph);
        const speciesParagraph = document.createElement('p');
        speciesParagraph.textContent = `Species: ${character.species}`;
        modalContent.appendChild(speciesParagraph);
        const genderParagraph = document.createElement('p');
        genderParagraph.textContent = `Gender: ${character.gender}`;
        modalContent.appendChild(genderParagraph);
        const originParagraph = document.createElement('p');
        originParagraph.classList.add('card-text');
        const originLabel = document.createElement('span');
        originLabel.textContent = 'Origin: ';
        const originLink = document.createElement('a');
        originLink.href = '#';
        originLink.classList.add('origin-link', 'text-decoration-none');
        originLink.textContent = character.origin.name;
        originLink.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            yield fetchLocation(character.origin.url);
            characterModal.hide();
        }));
        originParagraph.appendChild(originLabel);
        originParagraph.appendChild(originLink);
        modalContent.appendChild(originParagraph);
        const episodesTitle = document.createElement('p');
        episodesTitle.textContent = 'Episodes:';
        episodesTitle.classList.add('text-decoration-underline');
        modalContent.appendChild(episodesTitle);
        const episodesList = document.createElement('ul');
        episodesList.classList.add('list-unstyled');
        const episodeTitles = yield fetchEpisodeTitles(character.episode);
        episodeTitles.forEach((title, index) => {
            const episodeListItem = document.createElement('li');
            episodeListItem.classList.add('episode-list-element');
            const episodeLink = document.createElement('a');
            episodeLink.classList.add('episode-link', 'text-decoration-none');
            episodeLink.href = '#';
            episodeLink.textContent = title;
            episodeLink.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                const selectedEpisodeUrl = character.episode[index];
                const selectedEpisodeResponse = yield fetch(selectedEpisodeUrl);
                const selectedEpisode = yield selectedEpisodeResponse.json();
                const episodeDetailsContainer = document.getElementById('episodeDetailsContainer');
                if (episodeDetailsContainer) {
                    episodeDetailsContainer.replaceChildren();
                    const episodeDetails = document.createElement('div');
                    episodeDetails.classList.add('mb-3', 'mt-3');
                    const episodeName = document.createElement('h2');
                    episodeName.textContent = selectedEpisode.name;
                    episodeDetails.appendChild(episodeName);
                    const airDateParagraph = document.createElement('p');
                    airDateParagraph.textContent = `Air Date: ${selectedEpisode.air_date}`;
                    episodeDetails.appendChild(airDateParagraph);
                    const episodeNumberParagraph = document.createElement('p');
                    episodeNumberParagraph.textContent = `Episode: ${selectedEpisode.episode}`;
                    episodeDetails.appendChild(episodeNumberParagraph);
                    episodeDetailsContainer.appendChild(episodeDetails);
                    const characterRow = document.createElement('div');
                    characterRow.classList.add('row', 'row-cols-1', 'row-cols-md-2', 'row-cols-lg-4');
                    episodeDetailsContainer.appendChild(characterRow);
                    selectedEpisode.characters.forEach((characterUrl) => __awaiter(this, void 0, void 0, function* () {
                        const characterResponse = yield fetch(characterUrl);
                        const character = yield characterResponse.json();
                        const characterCard = createCharacterCard(character);
                        const characterCol = document.createElement('div');
                        characterCol.classList.add('col');
                        characterCol.appendChild(characterCard);
                        characterRow.appendChild(characterCol);
                    }));
                }
                characterModal.hide();
            }));
            episodeListItem.appendChild(episodeLink);
            episodesList.appendChild(episodeListItem);
        });
        modalContent.appendChild(episodesList);
        modalBody.appendChild(modalContent);
        characterModal.show();
    });
}
function fetchEpisodeTitles(episodeUrls) {
    return __awaiter(this, void 0, void 0, function* () {
        const episodeTitles = [];
        for (const episodeUrl of episodeUrls) {
            const response = yield fetch(episodeUrl);
            const episode = yield response.json();
            episodeTitles.push(`${episode.name} (${episode.episode})`);
        }
        return episodeTitles;
    });
}
fetchEpisodes();
