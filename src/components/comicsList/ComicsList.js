import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './comicsList.scss';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([])
    const [offset, setOffset] = useState(15)
    const [newComicsLoading, setNewComicsLoading] = useState(false)
    const [comicsEnded, setComicsEnded] = useState(false)

    const {loading, error, getAllComics} = useMarvelService()

    useEffect(()=>{
        onRequest(offset, true)
    }, [])


    const onRequest = (offset, initial) => {
        initial ? setNewComicsLoading(false) : setNewComicsLoading(true)

        getAllComics(offset)
            .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false
        if(newComicsList.length < 8){
            ended = true
        }

        setComicsList((comicsList)=>[...comicsList, ...newComicsList])
        setNewComicsLoading(false)
        setOffset((offset)=>offset+8)
        setComicsEnded(ended)
    }


    function renderComicsItem (arr){
        const items = arr.map((item, i)=>{

            return(
                <li className="comics__item"
                    key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.name} className="comics__item-img"/>
                        <div className="comics__item-name">{item.name}</div>
                        <div className="comics__item-price">{item.price !== 0 ? item.price : `free`}</div>
                    </Link>
                </li>
            )
        })

        return(
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderComicsItem(comicsList)
    const errorMessage = error ? <ErrorMessage/> : null
    const spinner = loading && !newComicsLoading ? <Spinner/> : null

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button className="button button__main button__long"
                    disabled={newComicsLoading}
                    onClick={()=>onRequest(offset)}
                    style={{'display': comicsEnded? 'none' : 'block'}}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;