import React, {useState, useContext} from 'react';
import Select from 'react-select';
import {SearchContext, FiltersType} from '../utils/context';
import {sortOptions, directorOptions, genreOptions, subGenreOptions, universeOptions, subUniverseOptions, characterOptions, sportholidayOptions, yearOptions, decadeOptions} from '../utils/filterData';

interface FiltersProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
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

    const handleFilters = () => {
        currentFilters(selectedFilters)
        setOpen(false);
    }

    const resetFilters = () => {
        setFilters({
            directors: [],
            sort: {
                value: "ASC",
                label: "Rating High to Low"
            },
            genres: [],
            subGenres: [],
            universes: [],
            subUniverses: [],
            characters: [],
            sportholidays: [],
            years: [],
            decades: []
        })
    }

    return(
        <div id="filter-panel">
            <div className="filter-select">
                <label>Sort By:</label>
                <Select className="sort" label="Sort By" onChange={(e:any) => changeFilter(e, "sort")} isSearchable={false} options={sortOptions} value={selectedFilters.sort} />
            </div> 
            <div className="filter-select">
                <label>Directors:</label>
                <Select className="sort" label="Directors" isMulti onChange={(e:any) => changeFilter(e, 'directors')} isSearchable={false} options={directorOptions} value={selectedFilters.directors} />
            </div>
            <div className="filter-select">
                <label>Genre:</label>
                <Select className="sort" label="Genre" isMulti onChange={(e:any) => changeFilter(e, 'genres')} isSearchable={false} options={genreOptions} value={selectedFilters.genres} />
            </div>
            <div className="filter-select">
                <label>Sub-Genre:</label>
                <Select className="sort" label="Sub-Genre" isMulti onChange={(e:any) => changeFilter(e, 'subGenres')} isSearchable={false} options={subGenreOptions} value={selectedFilters.subGenres}/>
            </div>
            <div className="filter-select">
                <label>Universe (Disney, Star Wars, DC, Marvel, etc.):</label>
                <Select className="sort" label="Universe" isMulti onChange={(e:any) => changeFilter(e, 'universes')} isSearchable={false} options={universeOptions} value={selectedFilters.universes}/>
            </div>
            <div className="filter-select">
                <label>Sub-Universe (MCU, DCEU, Pixar, etc.):</label>
                <Select className="sort" label="Sub-Universe" isMulti onChange={(e:any) => changeFilter(e, 'subUniverses')} isSearchable={false} options={subUniverseOptions} value={selectedFilters.subUniverses}/>
            </div>
            <div className="filter-select">
                <label>Characters:</label>
                <Select className="sort" label="Character" isMulti onChange={(e:any) => changeFilter(e, 'characters')} isSearchable={false} options={characterOptions} value={selectedFilters.characters}/>
            </div>
            <div className="filter-select">
                <label>Sport/Holiday:</label>
                <Select className="sort" label="Sport/Holiday" isMulti onChange={(e:any) => changeFilter(e, 'sportholidays')} isSearchable={false} options={sportholidayOptions} value={selectedFilters.sportholidays}/>
            </div>
            <div className="filter-select">
                <label>Year:</label>
                <Select className="sort" label="Year" isMulti onChange={(e:any) => changeFilter(e, 'years')} isSearchable={false} options={yearOptions} value={selectedFilters.years}/>
            </div>
            <div className="filter-select">
                <label>Decade:</label>
                <Select className="sort" label="Decade" isMulti onChange={(e:any) => changeFilter(e, 'decades')} isSearchable={false} options={decadeOptions} value={selectedFilters.decades}/>
            </div>
            <div id="filter-buttons">
                <button id="filter-apply" onClick={handleFilters}>Apply Filters</button>
                <button id="filter-reset" onClick={resetFilters}>Reset Filters</button>
            </div>
        </div>
    )
}

export default Filters;