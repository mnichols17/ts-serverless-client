import React, {useState} from 'react';
import Select from 'react-select';
import Review from '../utils/Review';
import request from '../utils/makeRequest';

interface SearchProps {
    queryResults: (reviews: Review[], reset?: boolean) => void;
}

const Search: React.FC<SearchProps> = ({queryResults}) => {

    const[typingTimeout, setTyping] = useState<NodeJS.Timeout | undefined>();
    const options: object[] = [
        {value: "default", label: "Best Match (Default)"},
        {value: "high", label: "High to Low"},
        {value: "low", label: "Low to High"},
    ]

    const queryRequestCreator = async(query: string) => new Promise((resolve, reject) => {
        if(typingTimeout) clearTimeout(typingTimeout)

        setTyping(setTimeout(async() => {
            try {
                const res:any = await request(`reviews/search/?query=${query}`)
                resolve(res.data)
            } 
            catch(e) {
                console.log("ERROR", e);
            }
        }, 500))
    })

    const handleQuery = async(e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        if(query === "") {
            if(typingTimeout) clearTimeout(typingTimeout)
            return queryResults([], true);
        }
        const res = await queryRequestCreator(e.target.value)
        queryResults(res as Review[]);
    }

    return(
        <div id="search">
            <input type="text" onChange={handleQuery} placeholder="Search by Title, Director or Genre"/>
            <Select id="filter" label="Sort By" isSearchable={false} options={options} defaultValue={options[0]}/>
        </div>
    )
}

export default Search;