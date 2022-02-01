import { Component } from 'react'
import propTypes from 'prop-types'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'

import MarvelService from '../../services/MarvelService'

import './charList.scss'

class CharList extends Component {
	state = {
		charList: [],
		loading: true,
		error: false,
		loadingNewItems: false,
		offset: 140,
		charEnded: false,
	}

	marvelService = new MarvelService()

	componentDidMount() {
		this.onRequest()
	}

	onCharListLoaded = (newCharList) => {
		let ended = false

		if (newCharList.length < 9) {
			ended = true
		}

		this.setState(({ charList, offset }) => ({
			charList: [...charList, ...newCharList],
			loading: false,
			loadingNewItems: false,
			offset: offset + 9,
			charEnded: ended,
		}))
	}

	onCharListLoading = () => {
		this.setState({
			loadingNewItems: true,
		})
	}

	onRequest = (offset) => {
		this.onCharListLoading()
		this.marvelService.getAllCharacters(offset).then(this.onCharListLoaded).catch(this.onError)
	}

	onError = () => {
		this.setState({
			loading: false,
			error: true,
		})
	}

	itemsRefs = []

	setRef = (ref) => {
		this.itemsRefs.push(ref)
	}

	focusOnItem = (id) => {
		this.itemsRefs.forEach((item) => {
			item.classList.remove('char__item_selected')
		})
		this.itemsRefs[id].classList.add('char__item_selected')
	}

	renderCharList = (charList) => {
		const charListArr = charList.map((item, i) => {
			let imgStyle = { objectFit: 'cover' }
			if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
				imgStyle = { objectFit: 'unset' }
			}

			return (
				<li
					ref={this.setRef}
					className="char__item"
					key={item.id}
					onClick={() => {
						this.props.onCharSelected(item.id)
						this.focusOnItem(i)
					}}
				>
					<img src={item.thumbnail} alt={item.name} style={imgStyle} />
					<div className="char__name">{item.name}</div>
				</li>
			)
		})

		return <ul className="char__grid">{charListArr}</ul>
	}

	render() {
		const { charList, loading, error, offset, loadingNewItems, charEnded } = this.state

		const items = this.renderCharList(charList)

		const errorMessage = error ? <ErrorMessage /> : null
		const spinner = loading ? <Spinner /> : null
		const content = !(loading || error) ? items : null

		return (
			<div className="char__list">
				{errorMessage}
				{spinner}
				{content}
				<button
					onClick={() => this.onRequest(offset)}
					className="button button__main button__long"
					disabled={loadingNewItems}
					style={{ display: charEnded ? 'none' : 'block' }}
				>
					<div className="inner">load more</div>
				</button>
			</div>
		)
	}
}

CharList.propTypes = {
	onCharSelected: propTypes.func.isRequired,
}

export default CharList
