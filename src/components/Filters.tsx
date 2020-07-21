import React, {useState, useEffect} from 'react';
import Select from 'react-select';
import {sortOptions, genreOptions, subGenreOptions, universeOptions, subUniverseOptions, characterOptions, sportholidayOptions} from '../utils/filterData';

interface FiltersProps {
    changeFilters: React.Dispatch<React.SetStateAction<object>>;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Filters: React.FC<FiltersProps> = ({changeFilters, setOpen}) => {

    const[sort, setSort] = useState<string>("ASC");
    const[genres, setGenres] = useState<string>("");
    const[subgenres, setSubGenre] = useState<string>("");
    const[universes, setUniverse] = useState<string>("");
    const[subuniverses, setSubU] = useState<string>("");
    const[characters, setCharacters] = useState<string>("");
    const[sportholidays, setSportHoliday] = useState<string>("");

    const changeSort = (selects: object[] | string, setter?: React.Dispatch<React.SetStateAction<string>>) => {
        if(setter) setter((selects as object[]).map((select: any) => select.value).join('@'))
        else setSort(selects as string);
    }

    const handleFilters = () => {
        changeFilters({
            sort,
            genres,
            subgenres,
            universes,
            subuniverses,
            characters,
            sportholidays
        })
        console.log({
            sort,
            genres,
            subgenres,
            universes,
            subuniverses,
            characters,
            sportholidays
        })
        setOpen(false);
    }

    return(
        <div id="filter-panel">
            <div className="filter-select">
                <label>Sort By:</label>
                <Select className="sort" label="Sort By" onChange={(e:any) => changeSort(e.value)} isSearchable={false} options={sortOptions} defaultValue={sortOptions[0]}/>
            </div> 
            <div className="filter-select">
                <label>Genre:</label>
                <Select className="sort" label="Genre" isMulti onChange={(e:any) => changeSort(e, setGenres)} isSearchable={false} options={genreOptions}/>
            </div>
            <div className="filter-select">
                <label>Sub-Genre:</label>
                <Select className="sort" label="Sub-Genre" isMulti onChange={(e:any) => changeSort(e, setSubGenre)} isSearchable={false} options={subGenreOptions}/>
            </div>
            <div className="filter-select">
                <label>Universe:</label>
                <Select className="sort" label="Universe" isMulti onChange={(e:any) => changeSort(e, setUniverse)} isSearchable={false} options={universeOptions}/>
            </div>
            <div className="filter-select">
                <label>Sub-Universe (Ex: MCU, DCEU, Pixar, etc.):</label>
                <Select className="sort" label="Sub-Universe" isMulti onChange={(e:any) => changeSort(e, setSubU)} isSearchable={false} options={subUniverseOptions}/>
            </div>
            <div className="filter-select">
                <label>Characters:</label>
                <Select className="sort" label="Characters" isMulti onChange={(e:any) => changeSort(e, setCharacters)} isSearchable={false} options={characterOptions}/>
            </div>
            <div className="filter-select">
                <label>Sport/Holiday:</label>
                <Select className="sort" label="Characters" isMulti onChange={(e:any) => changeSort(e, setSportHoliday)} isSearchable={false} options={sportholidayOptions}/>
            </div>
            <button id="filter-apply" onClick={handleFilters}>Apply Filters</button>
        </div>
    )
}

export default Filters;