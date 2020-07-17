import React, {useState, useEffect} from 'react';
import request from '../utils/makeRequest';
import ReviewList from './ReviewList';
import Review from '../utils/Review';
import Search from './Search';

import '../styles/home.css';

const Home: React.FC = () => {

    const[reviews, setReviews] = useState<Review[]>([]);
    const[itemSkips, setSkips] = useState<number>(0);
	const[empty, setEmpty] = useState<boolean>(false);
	const[preventRequest, setPrevent] = useState<boolean>(false);

    useEffect(() => {
        getReviews();
    }, [])    

    const queryResults = async(reviews: Review[], reset?: boolean) => {
		if(reset) getReviews(reset);
		else if(reviews.length > 0) {
			setReviews(reviews)
			if(empty) setEmpty(false);
			if(!preventRequest) setPrevent(true);
		}
		else {
			setEmpty(true);
		}
    }
    
    const getReviews = async(reset?: boolean) => {
        request('reviews/all', {skip: reset? 0 : itemSkips})
        .then((res: any) => {
            setSkips(reset? 1 : itemSkips+1)
			reset ? setReviews([...res.data]) : setReviews([...reviews, ...res.data])
			if(preventRequest) setPrevent(false);
        })
        .catch(err => console.error(err))
    }

    console.log(itemSkips)
    return(
        <div id="content">
            <Search queryResults={queryResults} />
            {empty ? <h2 id="empty">No results found</h2> : <ReviewList reviews={reviews} getReviews={getReviews} preventRequest={preventRequest}/>}
        </div>
    )
}

export default Home;