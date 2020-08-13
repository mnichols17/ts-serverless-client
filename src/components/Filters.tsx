import React, {useState, useContext} from 'react';
import Select from 'react-select';
import {SearchContext, FiltersType} from '../utils/context';
import {sortOptions, ratingOptions, directorOptions, genreOptions, subGenreOptions, studiocompanyOptions, 
    universeOptions, subUniverseOptions, characterOptions, sportholidayOptions, 
    yearOptions, decadeOptions, providerOptions, awardOptions} from '../utils/filterData';

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

const FilterSelect:React.FC<SelectProps> = ({label, onChange, options, value, info}) => (
    <div className="filter-select">
        <label className="filter-info">{label}</label>
        <Select className="sort" placeholder={info || "Select..."} label={label} isMulti closeMenuOnSelect={false} blurInputOnSelect={false} onChange={onChange} isSearchable={true} options={options} value={value} />
    </div>
)

const Filters: React.FC<FiltersProps> = ({setOpen}) => {

    const {viewList, filters, currentView, currentFilters} = useContext(SearchContext)
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
        currentFilters(!reset? selectedFilters : {}, reset)
        if(!viewList) currentView(true);
        setOpen(false);
    }

    const selects = [
        {label: "Streaming Provider:", onChange: (e:any) => changeFilter(e, 'providers'), options: providerOptions, value: selectedFilters.providers},
        {label: "Decade:", onChange: (e:any) => changeFilter(e, 'decades'), options: decadeOptions, value: selectedFilters.decades},
        {label: "Genre:", onChange: (e:any) => changeFilter(e, 'genres'), options: genreOptions, value: selectedFilters.genres, info: 'Ex: Action, Comedy, Drama, etc.'},
        {label: "Sub-Genre:", onChange: (e:any) => changeFilter(e, 'subGenres'), options: subGenreOptions, value: selectedFilters.subGenres, info: 'Ex: Comic, Romantic Comedy, etc.'},
        {label: "Director:", onChange: (e:any) => changeFilter(e, 'directors'), options: directorOptions, value: selectedFilters.directors},
        {label: "Studio/Company:", onChange: (e:any) => changeFilter(e, 'studiocompanies'), options: studiocompanyOptions, value: selectedFilters.studiocompanies, info: 'Ex: A24, Disney, Netflix, etc.'},
        {label: "Universe:", onChange: (e:any) => changeFilter(e, 'universes'), options: universeOptions, value: selectedFilters.universes, info: 'Ex: Disney Animated, MCU, etc.'},
        {label: "Sub-Universe:", onChange: (e:any) => changeFilter(e, 'subUniverses'), options: subUniverseOptions, value: selectedFilters.subUniverses, info: 'Ex: Pixar, Disney Remake, etc.'},
        {label: "Character:", onChange: (e:any) => changeFilter(e, 'characters'), options: characterOptions, value: selectedFilters.characters},
        {label: "Sport/Holiday:", onChange: (e:any) => changeFilter(e, 'sportholidays'), options: sportholidayOptions, value: selectedFilters.sportholidays},
        {label: "Year:", onChange: (e:any) => changeFilter(e, 'years'), options: yearOptions, value: selectedFilters.years},
        {label: "Awards:", onChange: (e:any) => changeFilter(e, 'awards'), options: awardOptions, value: selectedFilters.awards},
    ]

    return(
        <div id="filter-panel">
            <div id="filter-buttons">
                <button id="filter-apply" onClick={() => handleFilters()}>Apply Filters</button>
                <button id="filter-reset" onClick={() => handleFilters(true)}>Reset Filters</button>
            </div>
            <div className="filter-select">
                <label>Sort By:</label>
                <Select className="sort" label="Sort By" onChange={(e:any) => changeFilter(e, "sort")} isSearchable={false} options={sortOptions} value={selectedFilters.sort} />
            </div> 
            <div className="filter-select">
                <label>Ratings (Avg., Jeff's or KenJac's):</label>
                <Select className="sort" label="Ratings" onChange={(e:any) => changeFilter(e, "ratings")} isSearchable={false} options={ratingOptions} value={selectedFilters.ratings} />
            </div>
            {selects.map(({label, onChange, options, value, info}) => <FilterSelect key={label} label={label} onChange={onChange} options={options} value={value} info={info} />)}
        </div>
    )
}

export default Filters;