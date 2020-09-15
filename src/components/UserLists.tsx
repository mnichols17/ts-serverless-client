import React, {useState, useEffect, useContext, useRef} from 'react';
import List from './List';
import Search from './Search';
import { SearchContext } from '../utils/context';
import makeRequest from '../utils/makeRequest';
import { Review } from '../utils/entities';

const UserLists:React.FC = () => {

    const currList = useRef(true);
	const {loading, reviews, url, filters, page, getReviews, isLoading, currentUrl} = useContext(SearchContext);
    const[user_list, setUserList] = useState<Review[]>([])
    const[watchlist, setList] = useState<boolean>(true)
    const[open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        console.log("HIT UE on UL")
        //isLoading(true)
        //currentUrl('reviews/lists/username')
        if(!loading) isLoading(true);
            //type: watchlist? 'watch' : 'seen'
        console.log("SEARCHING WITH", watchlist? 'watch' : 'seen')
        getReviews('reviews/lists/username', {...filters, type: watchlist? 'watch' : 'seen'}, page, true);
    }, [watchlist])

    const switchList = (e:any) => {
        setList(e.target.id === 'watchlist')
    }

    console.log(watchlist)
    return(
        <div id="userLists">
            <div className="userLists-tab">
                <button id='watchlist' onClick={switchList} className={watchlist? 'active' : ''} >Watchlist</button>
                <button id='seenit' onClick={switchList} className={!watchlist? 'active' : ''}>SEEN IT</button>
            </div>
            <Search open={open} setOpen={setOpen} hide={true}/>
            <List fromUserList={true} />
        </div>
    )
}

export default UserLists;