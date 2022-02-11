import { useState, useEffect, useRef } from 'react'
import propTypes from 'prop-types'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'

import useMarvelService from '../../services/MarvelService'

import './charList.scss'

const CharList = (props) => {
	const [charList, setCharList] = useState([])
	const [loadingNewItems, setLoadingNewItems] = useState(false)
	const [offset, setOffset] = useState(600)
	const [charEnded, setCharEnded] = useState(false)

	const { loading, error, getAllCharacters } = useMarvelService()

	useEffect(() => {
		onRequest(offset, true)
	}, [])

	const onRequest = (offset, initial) => {
		initial ? setLoadingNewItems(false) : setLoadingNewItems(true)
		getAllCharacters(offset).then(onCharListLoaded)
	}

	const onCharListLoaded = (newCharList) => {
		let ended = false

		if (newCharList.length < 9) {
			ended = true
		}

		setCharList((charList) => [...charList, ...newCharList])
		setLoadingNewItems(false)
		setOffset((offset) => offset + 9)
		setCharEnded(ended)
	}

	const itemsRefs = useRef([])

	const focusOnItem = (id) => {
		console.log(itemsRefs)
		itemsRefs.current.forEach((item) => {
			item.classList.remove('char__item_selected')
		})
		itemsRefs.current[id].classList.add('char__item_selected')
	}

	function renderCharList(charList) {
		const charListArr = charList.map((item, i) => {
			let imgStyle = { objectFit: 'cover' }
			if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
				imgStyle = { objectFit: 'unset' }
			}

			return (
				<li
					ref={(el) => (itemsRefs.current[i] = el)}
					className="char__item"
					key={item.id}
					onClick={() => {
						props.onCharSelected(item.id)
						focusOnItem(i)
					}}
				>
					<img src={item.thumbnail} alt={item.name} style={imgStyle} />
					<div className="char__name">{item.name}</div>
				</li>
			)
		})

		return <ul className="char__grid">{charListArr}</ul>
	}

	const items = renderCharList(charList)

	const errorMessage = error ? <ErrorMessage /> : null
	const spinner = loading && !loadingNewItems ? <Spinner /> : null

	return (
		<div className="char__list">
			{errorMessage}
			{spinner}
			{items}
			<button
				onClick={() => onRequest(offset)}
				className="button button__main button__long"
				disabled={loadingNewItems}
				style={{ display: charEnded ? 'none' : 'block' }}
			>
				<div className="inner">load more</div>
			</button>
		</div>
	)
}

CharList.propTypes = {
	onCharSelected: propTypes.func.isRequired,
}

export default CharList
