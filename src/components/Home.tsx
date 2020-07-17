import React, {useState, useEffect} from 'react';
import Select from 'react-select';
import makeCalls from '../utils/makeCalls';
import ReactLoading from 'react-loading';
import Item from './Item';
import Review from '../utils/Review';

import '../styles/home.css';

const Home: React.FC = () => {

    const[query, setQuery] = useState("");
    const[items, setItems] = useState<Review[]>([]);
    const[fetchingData, setFetching] = useState(true);
    const[itemSkips, setSkips] = useState(0);

    useEffect(() => {
        makeCalls('reviews/all', {skip: itemSkips})
        .then((res: any) => {
            console.log(res.data)
            setItems(res.data)
            setFetching(false)
        })
        .catch(err => console.error(err))
    }, [])

    const options = [
        {value: "default", label: "Best Match (Default)"},
        {value: "high", label: "High to Low"},
        {value: "low", label: "Low to High"},
    ]

    const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }

    return(
        <div id="content">
            <div id="search">
                <input type="text" onChange={handleQuery} placeholder="Search by Title, Director or Genre"/>
                <Select id="filter" label="Sort By" isSearchable={false} options={options} defaultValue={options[0]}/>
            </div>
            {fetchingData ? <ReactLoading type={'spin'} color={'yellow'}/> : <ul>{items.map(({title, rating}) => <Item key={title} title={title} rating={rating} />)}</ul>}
        </div>
    )
}

// <ul>{items.map(item => <Item item={item} />)}</ul>

export default Home;