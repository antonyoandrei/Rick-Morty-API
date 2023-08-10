enum Status {
  Alive = "Alive",
  Dead = "Dead",
  Unknown = "unknown",
}

enum Gender {
  Male = "Male",
  Female = "Female",
  Unknown = "unknown",
  Genderless = "Genderless"
}

interface Episode {
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
}

interface Character {
  name: string;
  status: Status;
  species: string;
  gender: Gender;
  image: string;
  origin: {
    name: string;
    url: string;
  };
  episode: string[];
}

interface Location {
  name: string;
  type: string;
  dimension: string;
  residents: string[];
}

const API_URL = 'https://rickandmortyapi.com/api';
let page = 1;

async function fetchLocation(locationUrl: string): Promise<void> {
  try {
    const response = await fetch(locationUrl);
    const location: Location = await response.json();

    const episodeDetailsContainer = document.getElementById('episodeDetailsContainer');
    if (episodeDetailsContainer) {
      episodeDetailsContainer.innerHTML = '';

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
        const residentResponse = await fetch(residentUrl);
        const residentCharacter: Character = await residentResponse.json();
        const residentCard = createCharacterCard(residentCharacter);
        const residentCol = document.createElement('div');
        residentCol.classList.add('col');
        residentCol.appendChild(residentCard);
        residentsList.appendChild(residentCol);
      }

      locationDetails.appendChild(residentsList);
      episodeDetailsContainer.appendChild(locationDetails);
    }
  } catch (error) {
    console.error('Error fetching location:', error);
  }
}

function createEpisodeElement(episode: Episode): HTMLAnchorElement {
  const episodeItem = document.createElement('a');
  episodeItem.href = '#';
  episodeItem.classList.add('list-group-item', 'list-group-item-action');
  episodeItem.textContent = `${episode.episode}: ${episode.name} `;

  episodeItem.addEventListener('click', () => {
    fetchCharacters(episode);
  });

  return episodeItem;
}

function showLoadMoreButton(show: boolean): void {
  const loadMoreBtn = document.getElementById('loadMoreBtn')!;
  loadMoreBtn.classList.toggle('d-none', !show);
}

async function fetchEpisodes(): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/episode?page=${page}`);
    const data: { info: { next: string }; results: Episode[] } = await response.json();
    const episodes: Episode[] = data.results;
    const episodeList = document.getElementById('episodeList');

    episodes.forEach((episode) => {
      const episodeItem = createEpisodeElement(episode);
      episodeList?.appendChild(episodeItem);
    });

    showLoadMoreButton(!!data.info.next);
  } catch (error) {
    console.error('Error fetching episodes:', error);
  }
}

document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
  page++;
  fetchEpisodes();
});

function createCharacterCard(character: Character): HTMLDivElement {
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

async function fetchCharacters(episode: Episode): Promise<void> {
  try {
    const charactersUrls = episode.characters;
    const characters: Character[] = [];

    for (const characterUrl of charactersUrls) {
      const response = await fetch(characterUrl);
      const character: Character = await response.json();
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
  } catch (error) {
    console.error('Error fetching characters:', error);
  }
}

async function openCharacterModal(character: Character): Promise<void> {
  const characterModal = new bootstrap.Modal(document.getElementById('characterModal')!);

  const modalBody = document.getElementById('characterModalBody')!;
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

  originLink.addEventListener('click', async () => {
    await fetchLocation(character.origin.url);
    characterModal.hide();
  });

  originParagraph.appendChild(originLabel);
  originParagraph.appendChild(originLink);
  modalContent.appendChild(originParagraph);

  const episodesTitle = document.createElement('p');
  episodesTitle.textContent = 'Episodes:';
  episodesTitle.classList.add('text-decoration-underline');
  modalContent.appendChild(episodesTitle);

  const episodesList = document.createElement('ul');
  episodesList.classList.add('list-unstyled');
  const episodeTitles = await fetchEpisodeTitles(character.episode);
  episodeTitles.forEach((title, index) => {
    const episodeListItem = document.createElement('li');
    episodeListItem.classList.add('episode-list-element');
    const episodeLink = document.createElement('a');
    episodeLink.classList.add('episode-link', 'text-decoration-none')
    episodeLink.href = '#';
    episodeLink.textContent = title;
    episodeLink.addEventListener('click', async () => {
      const selectedEpisodeUrl = character.episode[index];
      const selectedEpisodeResponse = await fetch(selectedEpisodeUrl);
      const selectedEpisode: Episode = await selectedEpisodeResponse.json();

      const episodeDetailsContainer = document.getElementById('episodeDetailsContainer');
      if (episodeDetailsContainer) {
        episodeDetailsContainer.innerHTML = ''; 

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

        selectedEpisode.characters.forEach(async (characterUrl) => {
          const characterResponse = await fetch(characterUrl);
          const character: Character = await characterResponse.json();
          const characterCard = createCharacterCard(character);
          const characterCol = document.createElement('div');
          characterCol.classList.add('col');
          characterCol.appendChild(characterCard);
          characterRow.appendChild(characterCol);
        });
      }
      characterModal.hide();
    });
    episodeListItem.appendChild(episodeLink);
    episodesList.appendChild(episodeListItem);
  });
  modalContent.appendChild(episodesList);

  modalBody.appendChild(modalContent);

  characterModal.show();
}

async function fetchEpisodeTitles(episodeUrls: string[]): Promise<string[]> {
  const episodeTitles: string[] = [];

  for (const episodeUrl of episodeUrls) {
    const response = await fetch(episodeUrl);
    const episode: Episode = await response.json();
    episodeTitles.push(`${episode.name} (${episode.episode})`);
  }

  return episodeTitles;
}

fetchEpisodes();
