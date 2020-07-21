import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Filters from './Filters';

interface SearchProps {
    queryRequestCreator: (query: string) => Promise<void>; 
    changeFilters:  React.Dispatch<React.SetStateAction<object>>;
    filters: object;
}

const Search: React.FC<SearchProps> = ({queryRequestCreator, changeFilters, filters}) => {

    const [query, setQuery] = useState<string>("");
    const [firstQuery, setFirst] = useState<boolean>(true);
    const [open, setOpen] = useState<boolean>(false);

    const handleQuery = (e?: React.ChangeEvent<HTMLInputElement>) => {
        if(firstQuery) {
            setFirst(false);
            changeFilters({...filters, sort: ""});
        }
        const input = e? e.target.value : "";
        setQuery(input);
        queryRequestCreator(input);
    }

    return(
        <div id="search">
            <div id="search-input">
                <input type="text" value={query} onChange={handleQuery} placeholder="Search by Title or Director"/>
                <FontAwesomeIcon style={{color: query !== "" ? 'black' : 'white'}} onClick={() => query !== "" ? handleQuery() : null} id="clearSearch" icon={faTimes} size="lg"/>
            </div>
            <button id="filter-show" onClick={() => setOpen(!open)}>{open? "Hide" : "Filters"}</button>
            {open? <Filters changeFilters={changeFilters} setOpen={setOpen}/> : null}
        </div>
    )
}

export default Search;