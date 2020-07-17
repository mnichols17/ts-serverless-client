import React, {useState, useEffect} from 'react';
import Select from 'react-select';
import makeCalls from '../utils/makeCalls';
import ReviewList from './ReviewList';
import Review from '../utils/Review';

import '../styles/home.css';

const Home: React.FC = () => {

    const[query, setQuery] = useState("");
    const[reviews, setReviews] = useState<Review[]>([]);
    const[itemSkips, setSkips] = useState(0);

    useEffect(() => {
        getReviews();
    }, [])

    

    const options = [
        {value: "default", label: "Best Match (Default)"},
        {value: "high", label: "High to Low"},
        {value: "low", label: "Low to High"},
    ]

    const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }
    
    const getReviews = async() => {
        makeCalls('reviews/all', {skip: itemSkips})
        .then((res: any) => {
            setSkips(itemSkips+1)
            setReviews([...reviews, ...res.data])
        })
        .catch(err => console.error(err))
    }

    return(
        <div id="content">
            <div id="search">
                <input type="text" onChange={handleQuery} placeholder="Search by Title, Director or Genre"/>
                <Select id="filter" label="Sort By" isSearchable={false} options={options} defaultValue={options[0]}/>
            </div>
            <ReviewList reviews={reviews} getReviews={getReviews}/>
        </div>
    )
}

// <ul>{items.map(item => <Item item={item} />)}</ul>

export default Home;