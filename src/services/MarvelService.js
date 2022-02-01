class MarvelService {
	_apiBase = 'https://gateway.marvel.com:443/v1/public/'
	_apiKey = 'apikey=893a9b7dba2d7b81bf6c25ef2a7f0761'
	_baseOffset = 140

	getResources = async (url) => {
		let res = await fetch(url)

		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status ${res.status}`)
		}

		return await res.json()
	}

	getAllCharacters = async (offset = this._baseOffset) => {
		const res = await this.getResources(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`)
		return res.data.results.map(this._trasformCharacter)
	}

	getCharacter = async (id) => {
		const res = await this.getResources(`${this._apiBase}characters/${id}?${this._apiKey}`)
		return this._trasformCharacter(res.data.results[0])
	}

	_trasformCharacter = (char) => {
		return {
			id: char.id,
			name: char.name,
			description: char.description
				? `${char.description.slice(0, 200)}...`
				: 'This character doesnt have description.',
			thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			comics: char.comics.items,
		}
	}
}

export default MarvelService
