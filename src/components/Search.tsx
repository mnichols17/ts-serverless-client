import React, {useState, useContext} from 'react';
import { SearchContext } from '../utils/context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Filters from './Filters';

const Search: React.FC = () => {

    const {query, currentQuery} = useContext(SearchContext);
    const [open, setOpen] = useState<boolean>(false); // Might need to move to home page for a long filter panel

    const handleQuery = (e?: React.ChangeEvent<HTMLInputElement>) => {
        const input = e? e.target.value : "";
        currentQuery(input);
    }

    return(
        <>
            <div id="search">
                <div id="search-input">
                    <input type="text" value={query} onChange={handleQuery} placeholder="Search by Title, Director or Actor"/>
                    <FontAwesomeIcon style={{color: query !== "" ? 'black' : 'white'}} onClick={() => query !== "" ? handleQuery() : null} id="clearSearch" icon={faTimes} size="lg"/>
                </div>
                <button id="filter-show" onClick={() => setOpen(!open)}>{open? "Hide" : "Filters"}</button>
            </div>
            {open? <Filters setOpen={setOpen}/> : null}
        </>
    )
}

export default Search;