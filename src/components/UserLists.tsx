import React, {useState, useEffect, useContext} from 'react';
import List from './List';
import Search from './Search';
import { SearchContext } from '../utils/context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';

const UserLists:React.FC = (props:any) => {

	const {isLoading, currentType, checkAuth, loggedIn, viewList} = useContext(SearchContext);
    const[watchlist, setList] = useState<boolean>(true)
    const[open, setOpen] = useState<boolean>(false);
	const[showTop, setTop] = useState<boolean>(false);

    useEffect(() => {
        if(!loggedIn){
            isLoading(true);
            if(!checkAuth) props.history.push('/login')
        } else if (viewList !== 2){
            currentType(watchlist? 'watch' : 'seen')
        }
    }, [watchlist, checkAuth, viewList])

    useEffect(() => {
		window.addEventListener('scroll', checkTop)

		return () => window.removeEventListener('scroll', checkTop)
    }, [showTop, open])

    const switchList = (e:any) => {
        setList(e.target.id === 'watchlist')
        currentType(e.target.id === 'watchlist'? 'watch' : 'seen')
    }

    const checkTop = () => {
		if(!showTop && window.pageYOffset > (open? 1500:700)){
			setTop(true)
		} else if(showTop && window.pageYOffset <= (open? 1500:700)){
			setTop(false)
		}
	}

    return(
        checkAuth? null
        : <div id="userLists">
            <div className="userLists-tab">
                <button id='watchlist' onClick={switchList} className={watchlist? 'active' : ''} >Watchlist</button>
                <button id='seenit' onClick={switchList} className={!watchlist? 'active' : ''}>SEEN IT</button>
            </div>
            <Search fromUserList={true} open={open} setOpen={setOpen} hide={true}/>
            {viewList === 2 && <List />}
			<button id="send-top" className="title-font" hidden={!(showTop && viewList)} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Top <FontAwesomeIcon icon={faChevronUp} /></button>
        </div>
    )
}

export default UserLists;