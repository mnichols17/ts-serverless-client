import React from 'react';
import Select from 'react-select';

interface SearchProps {
    queryRequestCreator: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>; 
    changeFilter:  React.Dispatch<React.SetStateAction<string>>;
}

const Search: React.FC<SearchProps> = ({queryRequestCreator, changeFilter}) => {
    
    const options: object[] = [
        {value: "", label: "Best Match"},
        {value: "ASC", label: "High to Low (Rating)"},
        {value: "DESC", label: "Low to High (Rating)"},
    ]

    return(
        <div id="search">
            <input type="text" onChange={queryRequestCreator} placeholder="Search by Title, Director or Genre"/>
            <Select id="filter" label="Sort By" onChange={(e:any) => changeFilter(e.value)} isSearchable={false} options={options} defaultValue={options[0]}/>
        </div>
    )
}

export default Search;