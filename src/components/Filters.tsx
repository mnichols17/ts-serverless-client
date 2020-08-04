import React, {useState, useContext} from 'react';
import Select from 'react-select';
import {SearchContext, FiltersType} from '../utils/context';
import {sortOptions, directorOptions, genreOptions, subGenreOptions, studiocompanyOptions, 
    universeOptions, subUniverseOptions, characterOptions, sportholidayOptions, 
    yearOptions, decadeOptions, providerOptions, oscarOptions, globesOptions} from '../utils/filterData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

interface FiltersProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SelectProps {
    label: string;
    onChange: (e: any) => void;
    options: object[];
    value: object[];
    info?: string;
}

const FilterSelect:React.FC<SelectProps> = ({label, onChange, options, value, info}) => {
    
    const[open, setOpen] = useState<boolean>(false);
    console.log(info)
    return(
        <div className="filter-select">
            <label className="filter-info">{label}<FontAwesomeIcon className={open? "filter-icon-open" : "filter-icon"} visibility={info? 'visible':'hidden'} onClick={() => setOpen(!open)} icon={faInfoCircle} /><span hidden={!open} className="tooltip">{info}</span></label>
            <Select className="sort" label={label} isMulti closeMenuOnSelect={false} blurInputOnSelect={false} onChange={onChange} isSearchable={true} options={options} value={value} />
        </div>
    )
}

const Filters: React.FC<FiltersProps> = ({setOpen}) => {

    const {filters, currentFilters} = useContext(SearchContext)
    const[selectedFilters, setFilters] = useState<FiltersType>(filters)

    const changeFilter = (e: any, key: string) => {
        setFilters((prevState: FiltersType) => {
            return {
                ...prevState,
                [key]: e || []
            }
        })
    }

    const handleFilters = (reset?: boolean) => {
        currentFilters(!reset? selectedFilters : {
            directors: [],
            sort: {
                value: "ASC",
                label: "Rating High to Low"
            },
            genres: [],
            subGenres: [],
            universes: [],
            subUniverses: [],
            studiocompanies: [],
            characters: [],
            sportholidays: [],
            years: [],
            decades: [],
            providers: [],
            oscars: [],
            goldenglobes: []
        })
        setOpen(false);
    }

    const selects = [
        {label: "Director:", onChange: (e:any) => changeFilter(e, 'directors'), options: directorOptions, value: selectedFilters.directors},
        {label: "Genre:", onChange: (e:any) => changeFilter(e, 'genres'), options: genreOptions, value: selectedFilters.genres, info: 'Ex: Action, Comedy, Drama, etc.'},
        {label: "Sub-Genre:", onChange: (e:any) => changeFilter(e, 'subGenres'), options: subGenreOptions, value: selectedFilters.subGenres, info: 'Ex: Comic, Heist, Romantic Comedy, etc.'},
        {label: "Studio/Company:", onChange: (e:any) => changeFilter(e, 'studiocompanies'), options: studiocompanyOptions, value: selectedFilters.studiocompanies, info: 'Ex: A24, Disney, Marvel, Netflix, etc.'},
        {label: "Universe:", onChange: (e:any) => changeFilter(e, 'universes'), options: universeOptions, value: selectedFilters.universes, info: 'Ex: DCEU, Disney Animated, MCU, Star Wars, etc.'},
        {label: "Sub-Universe:", onChange: (e:any) => changeFilter(e, 'subUniverses'), options: subUniverseOptions, value: selectedFilters.subUniverses, info: 'Ex: Harry Potter, Lord of the Rings, Pixar, etc.'},
        {label: "Character:", onChange: (e:any) => changeFilter(e, 'characters'), options: characterOptions, value: selectedFilters.characters},
        {label: "Sport/Holiday:", onChange: (e:any) => changeFilter(e, 'sportholidays'), options: sportholidayOptions, value: selectedFilters.sportholidays},
        {label: "Year:", onChange: (e:any) => changeFilter(e, 'years'), options: yearOptions, value: selectedFilters.years},
        {label: "Decade:", onChange: (e:any) => changeFilter(e, 'decades'), options: decadeOptions, value: selectedFilters.decades},
        {label: "Streaming Provider:", onChange: (e:any) => changeFilter(e, 'providers'), options: providerOptions, value: selectedFilters.providers},
        {label: "Oscars:", onChange: (e:any) => changeFilter(e, 'oscars'), options: oscarOptions, value: selectedFilters.oscars},
        {label: "Golden Globes:", onChange: (e:any) => changeFilter(e, 'goldenglobes'), options: globesOptions, value: selectedFilters.goldenglobes},
    ]

    return(
        <div id="filter-panel">
            <div className="filter-select">
                <label>Sort By:</label>
                <Select className="sort" label="Sort By" onChange={(e:any) => changeFilter(e, "sort")} isSearchable={false} options={sortOptions} value={selectedFilters.sort} />
            </div> 
            {selects.map(({label, onChange, options, value, info}) => <FilterSelect key={label} label={label} onChange={onChange} options={options} value={value} info={info} />)}
            <div id="filter-buttons">
                <button id="filter-apply" onClick={() => handleFilters()}>Apply Filters</button>
                <button id="filter-reset" onClick={() => handleFilters(true)}>Reset Filters</button>
            </div>
        </div>
    )
}

export default Filters;