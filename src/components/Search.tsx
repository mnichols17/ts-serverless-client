import React, {useContext} from 'react';
import { SearchContext } from '../utils/context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSort } from '@fortawesome/free-solid-svg-icons';
import Filters from './Filters';

interface SearchProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Search: React.FC<SearchProps> = ({open, setOpen}) => {

    const {query, currentQuery} = useContext(SearchContext);

    const handleQuery = (e?: React.ChangeEvent<HTMLInputElement>) => {
        const input = e? e.target.value : "";
        currentQuery(input);
    }

    return(
        <>
            <h3>Use filters to find where movies are streaming, and more...</h3>
            <div id="search">
                <button id="filter-show" onClick={() => setOpen(!open)}>{open? "Hide" : "Filters"} <FontAwesomeIcon icon={faSort} /></button>
                <div id="search-input">
                    <input type="text" value={query} onChange={handleQuery} placeholder="Search by Title, Director, Actor..."/>
                    <FontAwesomeIcon style={{display: query !== "" ? 'block' : 'none'}} onClick={() => query !== "" ? handleQuery() : null} id="clearSearch" icon={faTimes} size="lg"/>
                </div>
            </div>
            {open? <Filters setOpen={setOpen}/> : null}
        </>
    )
}

export default Search;