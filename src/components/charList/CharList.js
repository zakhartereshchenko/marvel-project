
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types'

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import './charList.scss';

const setContent = (process, Component, newItemsLoading) => {
    switch(process){
        case 'waiting':
            return <Spinner/>
        case 'loading':
            return newItemsLoading ? <Component/> : <Spinner/>
        case 'confirmed':
            return <Component/>
        case 'error':
            return <ErrorMessage/>
        default:
            return new Error('unexpected process state')
    }
}  

const CharList = (props) => {

    const [charList, setCharList] = useState([])
    const [offset, setOffset] = useState(210)
    const [newItemsLoading, setNewItemsLoading] = useState(false)
    const [charEnded, setCharEnded] = useState(false)


    const {process, setProcess, getAllCharacters} = useMarvelService()

    useEffect(()=>{
        onRequest(offset, true)
    },[])

    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true)

        getAllCharacters(offset)
            .then(onCharsListLoaded)
            .then(()=> setProcess('confirmed'))
            
    }

    const onCharsListLoaded = (newCharsList) => {
        let ended = false
        if(newCharsList.length < 9){
            ended = true
        }

        setCharList((charList)=>[...charList, ...newCharsList])
        setNewItemsLoading(false)
        setOffset((offset)=>offset+9)
        setCharEnded(ended)
    }


    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function renderItem(arr){
        const items = arr.map((item, i)=>{
            let imgStyle = {'objectFit' : 'cover'}
            if(item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'){
                imgStyle = {'objectFit' : 'unset'}
            }

            return (
                <li className="char__item"
                    ref={el => itemRefs.current[i]=el}
                    key={item.id}
                    onClick = {()=>{
                        props.onCharSelected(item.id)
                        focusOnItem(i)
                    }}
                    >
                    <img src={item.thumbnail} alt={item.name} style = {imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })
        
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
    
    return (
        <div className="char__list">
            {setContent(process, () => renderItem(charList), newItemsLoading)}
            <button 
            className="button button__main button__long"
            disabled={newItemsLoading}
            onClick={()=>onRequest(offset)}
            style={{'display': charEnded? 'none' : 'block'}}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
    
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;