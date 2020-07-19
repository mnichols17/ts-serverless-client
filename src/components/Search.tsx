import React, {useState} from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface SearchProps {
    queryRequestCreator: (query: string) => Promise<void>; 
    changeSort:  React.Dispatch<React.SetStateAction<string>>;
}

const Search: React.FC<SearchProps> = ({queryRequestCreator, changeSort}) => {

    const [query, setQuery] = useState("");
    
    const options: object[] = [
        {value: "", label: "Best Match"},
        {value: "ASC", label: "High to Low (Rating)"},
        {value: "DESC", label: "Low to High (Rating)"},
    ]

    const handleQuery = (e?: React.ChangeEvent<HTMLInputElement>) => {
        const input = e? e.target.value : "";
        setQuery(input);
        queryRequestCreator(input);
    }

    return(
        <div id="search">
            <div id="search-input">
                <input type="text" value={query} onChange={handleQuery} placeholder="Search by Title, Director or Genre"/>
                <FontAwesomeIcon style={{color: query !== "" ? 'black' : 'white'}} onClick={() => query !== "" ? handleQuery() : null} id="clearSearch" icon={faTimes} size="lg"/>
            </div>
            {/* <input type="text" onChange={queryRequestCreator} placeholder="Search by Title, Director or Genre"/> */}
            <Select id="sort" label="Sort By" onChange={(e:any) => changeSort(e.value)} isSearchable={false} options={options} defaultValue={options[0]}/>
        </div>
    )
}

export default Search;