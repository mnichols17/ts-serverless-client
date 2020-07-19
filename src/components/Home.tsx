import React, {useState, useEffect} from 'react';
import request from '../utils/makeRequest';
import ReviewList from './ReviewList';
import Review from '../utils/Review';
import Search from './Search';
import ReactLoading from 'react-loading';

import '../styles/home.css';

const Home: React.FC = () => {

	const[reviews, setReviews] = useState<Review[]>([]);
	const[url, setUrl] = useState<string>('reviews/all');
	const[sort, setSort] = useState<string>("ASC");
    const[itemSkips, setSkips] = useState<number>(0);
	const[typingTimeout, setTyping] = useState<NodeJS.Timeout | undefined>();
	const[more, setMore] = useState<boolean>(true);
	const[loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
		getReviews();
	}, []) 
	
	useEffect(() => {
		getReviews(true);
	}, [url, sort])

	const queryRequestCreator = async(query: string) => {
		setLoading(true);
		if(typingTimeout) clearTimeout(typingTimeout)

        if(query === "") {
			setUrl('reviews/all')
        } else {
			setTyping(setTimeout(async() => {
				setUrl(`reviews/search/?query=${query}`)
			}, 500))
		}
    }
	
	const getReviews = async(reset?: boolean, fromScroll?: boolean) => {
		console.log(url, sort);
        request(url, {sort, skip: reset? 0 : itemSkips})
        .then((res: any) => {
			setLoading(false);
			// !res.data.length && fromScroll || <--- Keep just incase
			if(res.data.length < 30) setMore(false);
			else if(!more) setMore(true);

			setSkips(reset? 1 : itemSkips+1)
			setReviews(reset? res.data : [...reviews, ...res.data])
        })
        .catch(err => console.error(err))
	}

    console.log(itemSkips)
    return(
		<div id="content">
			<Search queryRequestCreator={queryRequestCreator} changeSort={setSort}/>
			{loading? <ReactLoading type={"spin"} color={"yellow"}/> : <ReviewList reviews={reviews} getReviews={getReviews} more={more}/>}
		</div>
    )
}

export default Home;