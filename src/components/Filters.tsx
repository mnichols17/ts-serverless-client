import React, {useState, useContext} from 'react';
import Select from 'react-select';
import {SearchContext, FiltersType} from '../utils/context';
import {sortOptions, ratingOptions, directorOptions, genreOptions, subGenreOptions, studiocompanyOptions, 
    universeOptions, subUniverseOptions, characterOptions, sportholidayOptions, 
    yearOptions, decadeOptions, providerOptions, awardOptions} from '../utils/filterData';


interface FilterSliderProps {
    label: string;
    onChange: (e: any) => void;
    info: string | number[];
}

const FilterSlider:React.FC<FilterSliderProps> = ({label, onChange, info}) => {

    const runtime = label === "Runtime";

    const rangeChange = (e:any) => {
        const value = parseInt(e.target.value)
        if(e.target.id === "dr-1") {
            if(value === 100) onChange([100, 100])
            else if(value >= info[1]) onChange([value, value+1])
            else onChange([value, info[1]])
        }
        else {
            if(value === 0) onChange([0, 0])
            else if(value <= info[0]) onChange([value-1, value])
            else onChange([info[0], value])
        }
    }

    return(
        runtime? <>
            <label className="filter-info">{label}: Under {info} minutes</label>
            <input id="filter-range" className="range" type='range' min={'63'} max={'229'} defaultValue={info as string} onChange={onChange} />
        </> :
        <>
            <label className="filter-info">Rating: {info[0]} - {info[1]}</label>
            <div className="double-range">
                <input hidden={info[1] === 0} id="dr-1" className="double-input-range" type='range' min='0' max='100' value={info[0]} onChange={rangeChange}/> 
                <input hidden={info[0] === 100} id="dr-2" className="double-input-range" type='range' min='0' max='100' value={info[1]} onChange={rangeChange}/>
            </div>
        </>
    )
}

interface SelectProps {
    index: number;
    label: string;
    onChange: (e: any) => void;
    options: object[];
    value: object[] | { value: string; label: string | JSX.Element; };
    multi: boolean;
    search: boolean;
    info?: string | JSX.Element | number[];
}

const FilterSelect:React.FC<SelectProps> = ({index, label, onChange, options, value, multi, search, info}) => (
    <div className="filter-select">
        {!options.length? <FilterSlider label={label} onChange={onChange} info={info as (string | number[])}/>
        : <><label className={index <= 1? "filter-info bold" : "filter-info"}>{label}</label>
        <Select className="sort" placeholder={info || "Select..."} label={label} isMulti={multi} closeMenuOnSelect={!multi} blurInputOnSelect={!multi} onChange={onChange} isSearchable={search} options={options} value={value} /></>}
    </div>
)

interface FiltersProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

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
        if(!viewList) currentView(true); // MOVE TO CONTEXT?
        setOpen(false);
    }

    const providerInfo = <div className="filter-flex placeholder-flex">
        <img style={{marginLeft: 0}} className="filter-provider" src={require(`../media/providers/8.png`)} alt={'test'}/>
        <img className="filter-provider" src={require(`../media/providers/15.png`)} alt={'test'}/>
        <img className="filter-provider" src={require(`../media/providers/337.png`)} alt={'test'}/>
        <img style={{marginRight: "4px"}} className="filter-provider" src={require(`../media/providers/384.png`)} alt={'test'}/>
        + more
    </div>

    const selects = [
        {label: "Streaming Provider:", onChange: (e:any) => changeFilter(e, 'providers'), options: providerOptions, value: selectedFilters.providers, multi: true, search: false, info: providerInfo},
        {label: "Ratings (Avg., Jeff's or KenJac's):", onChange: (e:any) => changeFilter(e, 'ratings'), options: ratingOptions, value: selectedFilters.ratings, multi: false, search: false},
        {label: "Sort Reviews:", onChange: (e:any) => changeFilter(e, 'sort'), options: sortOptions, value: selectedFilters.sort, multi: false, search: false},
        {label: "Awards:", onChange: (e:any) => changeFilter(e, 'awards'), options: awardOptions, value: selectedFilters.awards, multi: true, search: false, info: 'Ex: Oscars, Golden Globes'},
        
        {label: "Rating", onChange: (newRange: number[]) => changeFilter(newRange, 'ratingRange'), options: [], value: [], multi: false, search: false, info: selectedFilters.ratingRange},
        {label: "Runtime", onChange: (e:any) => changeFilter({value: e.target.value, label: e.target.value}, 'runtime'), options: [], value: [], multi: false, search: false, info: selectedFilters.runtime.value},
        
        {label: "Decade:", onChange: (e:any) => changeFilter(e, 'decades'), options: decadeOptions, value: selectedFilters.decades, multi: true, search: false},
        {label: "Year:", onChange: (e:any) => changeFilter(e, 'years'), options: yearOptions, value: selectedFilters.years, multi: true, search: true},
        {label: "Genre:", onChange: (e:any) => changeFilter(e, 'genres'), options: genreOptions, value: selectedFilters.genres, multi: true, search: false, info: 'Ex: Action, Comic, Drama, etc.'},
        {label: "Sub-Genre:", onChange: (e:any) => changeFilter(e, 'subGenres'), options: subGenreOptions, value: selectedFilters.subGenres, multi: true, search: false, info: 'Ex: Heist, Romantic Comedy, etc.'},
        {label: "Director:", onChange: (e:any) => changeFilter(e, 'directors'), options: directorOptions, value: selectedFilters.directors, multi: true, search: true, info: "Minimum 3 movies in Database"},
        {label: "Studio/Company:", onChange: (e:any) => changeFilter(e, 'studiocompanies'), options: studiocompanyOptions, value: selectedFilters.studiocompanies, multi: true, search: false, info: 'Ex: A24, Disney, Netflix, etc.'},
        {label: "Universe:", onChange: (e:any) => changeFilter(e, 'universes'), options: universeOptions, value: selectedFilters.universes, multi: true, search: false, info: 'Ex: Disney Animated, MCU, etc.'},
        {label: "Sub-Universe:", onChange: (e:any) => changeFilter(e, 'subUniverses'), options: subUniverseOptions, value: selectedFilters.subUniverses, multi: true, search: false, info: 'Ex: Pixar, Disney Remake, etc.'},
        {label: "Sport/Holiday:", onChange: (e:any) => changeFilter(e, 'sportholidays'), options: sportholidayOptions, value: selectedFilters.sportholidays, multi: true, search: false, info: 'Ex: Football, Christmas, etc.'},
        {label: "Character/Actor:", onChange: (e:any) => changeFilter(e, 'characters'), options: characterOptions, value: selectedFilters.characters, multi: true, search: false, info: 'Ex: Batman, Nic Cage, etc.'},
    ]

    return(
        <div id="filter-panel">
            <div id="filter-buttons">
                <button id="filter-apply" onClick={() => handleFilters()}>Apply Filters</button>
                <button id="filter-reset" onClick={() => handleFilters(true)}>Reset Filters</button>
            </div>
            {selects.map(({label, onChange, options, value, multi, search, info}, index) => 
                <FilterSelect key={index} index={index} label={label} onChange={onChange} options={options} 
                                value={value} multi={multi} search={search} info={info} />)}
        </div>
    )
}

export default Filters;