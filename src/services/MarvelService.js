import { useHttp } from '../hooks/http.hook'

const useMarvelService = () => {
	const { loading, error, request, clearError } = useHttp()

	const _apiBase = 'https://gateway.marvel.com:443/v1/public/'
	const _apiKey = 'apikey=893a9b7dba2d7b81bf6c25ef2a7f0761'
	const _baseOffset = 140

	const getComics = async (id) => {
		const res = await request(`${_apiBase}comics/${id}?${_apiKey}`)
		return _trasformComics(res.data.results[0])
	}

	const getAllComics = async (offset = _baseOffset) => {
		const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`)
		return res.data.results.map(_trasformComics)
	}

	const getAllCharacters = async (offset = _baseOffset) => {
		const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`)
		return res.data.results.map(_trasformCharacter)
	}

	const getCharacter = async (id) => {
		const res = await request(`${_apiBase}characters/${id}?${_apiKey}`)
		return _trasformCharacter(res.data.results[0])
	}

	const _trasformCharacter = (char) => {
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

	const _trasformComics = (comics) => {
		console.log(comics)
		return {
			id: comics.id,
			title: comics.title,
			description: comics.description,
			pages: comics.page,
			thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
			language: comics.textObjects[0] ? `${comics.textObjects[0].language}` : 'no information',
			price: comics.prices[0].price ? `${comics.prices[0].price}$` : 'not available',
		}
	}

	return { loading, error, getAllCharacters, getCharacter, clearError, getAllComics, getComics }
}

export default useMarvelService
