import React, {useState, useEffect} from 'react';
import request from '../utils/makeRequest';
import ReviewList from './ReviewList';
import Review from '../utils/Review';
import Search from './Search';

import '../styles/home.css';

const Home: React.FC = () => {

	const[reviews, setReviews] = useState<Review[]>([]);
	const[url, setUrl] = useState<string>('reviews/all');
	const[filter, setFilter] = useState<string>("");
    const[itemSkips, setSkips] = useState<number>(0);
	const[empty, setEmpty] = useState<boolean>(false);
	const[typingTimeout, setTyping] = useState<NodeJS.Timeout | undefined>();
	const[more, setMore] = useState<boolean>(true);

    useEffect(() => {
		getReviews();
	}, []) 
	
	useEffect(() => {
		getReviews(true);
	}, [url, filter])

	const queryRequestCreator = async(e: React.ChangeEvent<HTMLInputElement>) => {
		const query = e.target.value;
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
		console.log(url, filter);
        request(url, {filter, skip: reset? 0 : itemSkips})
        .then((res: any) => {
			if(!res.data.length){
				if(!fromScroll) return setEmpty(true)
				else setMore(false);
			}
			else if(empty) setEmpty(false)
			else if(!more) setMore(true);
            setSkips(reset? 1 : itemSkips+1)
			reset? setReviews(res.data) : setReviews([...reviews, ...res.data]);
        })
        .catch(err => console.error(err))
	}

    console.log(itemSkips)
    return(
		<div id="content">
			<Search queryRequestCreator={queryRequestCreator} changeFilter={setFilter}/>
			{empty ? <h2 id="empty">No results found</h2> : <ReviewList reviews={reviews} getReviews={getReviews} more={more}/>}
		</div>
    )
}

export default Home;