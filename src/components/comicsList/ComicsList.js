import { useState, useEffect } from 'react'
import useMarvelService from '../../services/MarvelService'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'

import './comicsList.scss'

const ComicsList = () => {
	const [comicsList, setComicsList] = useState([])
	const [loadingNewItems, setLoadingNewItems] = useState(false)
	const [offset, setOffset] = useState(890)
	const [comicsEnded, setComicsEnded] = useState(false)

	const { getAllComics, loading, error } = useMarvelService()

	useEffect(() => {
		console.log('useEffect first')
		onRequest(offset, true)
	}, [])

	const onRequest = (offset, initial) => {
		initial ? setLoadingNewItems(false) : setLoadingNewItems(true)
		getAllComics(offset).then(onComicsListLoaded)
	}

	const onComicsListLoaded = (newComicsList) => {
		let ended = false
		if (newComicsList.length < 8) {
			ended = true
		}

		setComicsEnded(ended)
		setOffset((offset) => offset + 8)
		setLoadingNewItems(false)
		setComicsList((comicsList) => [...comicsList, ...newComicsList])
	}

	const renderComics = (comicsList) => {
		const renderComicsArr = comicsList.map((item, i) => {
			console.log(item)
			return (
				<li className="comics__item" key={i}>
					<a href="#">
						<img src={item.thumbnail} alt={item.title} className="comics__item-img" />
						<div className="comics__item-name">{item.title}</div>
						<div className="comics__item-price">{item.price}</div>
					</a>
				</li>
			)
		})

		return <ul className="comics__grid">{renderComicsArr}</ul>
	}

	const items = renderComics(comicsList)
	const errorMessage = error ? <ErrorMessage /> : null
	const spinner = loading ? <Spinner /> : null

	return (
		<div className="comics__list">
			{items}
			{spinner}
			{errorMessage}

			<button
				className="button button__main button__long"
				onClick={() => onRequest(offset)}
				disabled={loadingNewItems}
				style={{ display: comicsEnded ? 'none' : 'block' }}
			>
				<div className="inner">load more</div>
			</button>
		</div>
	)
}

export default ComicsList
