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
    index: number;
    label: string;
    onChange: (e: any) => void;
    options: object[];
    value: object[] | {
        value: string;
        label: string | JSX.Element;
    };
    multi: boolean;
    search: boolean;
    info?: string | JSX.Element;
}

const FilterSelect:React.FC<SelectProps> = ({index, label, onChange, options, value, multi, search, info}) => (
    <div className="filter-select">
        <label className={index <= 1? "filter-info bold" : "filter-info"}>{label}</label>
        <Select className="sort" placeholder={info || "Select..."} label={label} isMulti={multi} closeMenuOnSelect={!multi} blurInputOnSelect={!multi} onChange={onChange} isSearchable={search} options={options} value={value} />
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
        {label: "Sort Ratings (Highest or Lowest):", onChange: (e:any) => changeFilter(e, 'sort'), options: sortOptions, value: selectedFilters.sort, multi: false, search: false},
        {label: "Decade:", onChange: (e:any) => changeFilter(e, 'decades'), options: decadeOptions, value: selectedFilters.decades, multi: true, search: false},
        {label: "Genre:", onChange: (e:any) => changeFilter(e, 'genres'), options: genreOptions, value: selectedFilters.genres, multi: true, search: false, info: 'Ex: Action, Comedy, Drama, etc.'},
        {label: "Sub-Genre:", onChange: (e:any) => changeFilter(e, 'subGenres'), options: subGenreOptions, value: selectedFilters.subGenres, multi: true, search: false, info: 'Ex: Comic, Romantic Comedy, etc.'},
        {label: "Director:", onChange: (e:any) => changeFilter(e, 'directors'), options: directorOptions, value: selectedFilters.directors, multi: true, search: true},
        {label: "Studio/Company:", onChange: (e:any) => changeFilter(e, 'studiocompanies'), options: studiocompanyOptions, value: selectedFilters.studiocompanies, multi: true, search: false, info: 'Ex: A24, Disney, Netflix, etc.'},
        {label: "Universe:", onChange: (e:any) => changeFilter(e, 'universes'), options: universeOptions, value: selectedFilters.universes, multi: true, search: false, info: 'Ex: Disney Animated, MCU, etc.'},
        {label: "Sub-Universe:", onChange: (e:any) => changeFilter(e, 'subUniverses'), options: subUniverseOptions, value: selectedFilters.subUniverses, multi: true, search: false, info: 'Ex: Pixar, Disney Remake, etc.'},
        {label: "Character:", onChange: (e:any) => changeFilter(e, 'characters'), options: characterOptions, value: selectedFilters.characters, multi: true, search: false},
        {label: "Sport/Holiday:", onChange: (e:any) => changeFilter(e, 'sportholidays'), options: sportholidayOptions, value: selectedFilters.sportholidays, multi: true, search: false},
        {label: "Year:", onChange: (e:any) => changeFilter(e, 'years'), options: yearOptions, value: selectedFilters.years, multi: true, search: true},
        {label: "Awards:", onChange: (e:any) => changeFilter(e, 'awards'), options: awardOptions, value: selectedFilters.awards, multi: true, search: false},
    ]

    return(
        <div id="filter-panel">
            <div id="filter-buttons">
                <button id="filter-apply" onClick={() => handleFilters()}>Apply Filters</button>
                <button id="filter-reset" onClick={() => handleFilters(true)}>Reset Filters</button>
            </div>
            {/* <div className="filter-select">
                <label>Ratings (Avg., Jeff's or KenJac's):</label>
                <Select className="sort" label="Ratings" onChange={(e:any) => changeFilter(e, "ratings")} isSearchable={false} options={ratingOptions} value={selectedFilters.ratings} />
            </div>
            <div className="filter-select">
                <label>Sort By:</label>
                <Select className="sort" label="Sort By" onChange={(e:any) => changeFilter(e, "sort")} isSearchable={false} options={sortOptions} value={selectedFilters.sort} />
            </div>  */}
            {selects.map(({label, onChange, options, value, multi, search, info}, index) => <FilterSelect key={index} index={index} label={label} onChange={onChange} options={options} value={value} multi={multi} search={search} info={info} />)}
        </div>
    )
}

export default Filters;