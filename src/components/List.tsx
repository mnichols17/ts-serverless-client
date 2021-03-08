import React, {useEffect, useContext} from 'react';
import ReviewList from './ReviewList';
import ReactLoading from 'react-loading';
import smoothscroll from 'smoothscroll-polyfill';
import {SearchContext} from '../utils/context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { Review } from '../utils/entities';

interface PaginationProps {
	changePage: (e:any) => void;
}

export const Pagination: React.FC<PaginationProps> = ({changePage}) => {
	const {page, totalPages} = useContext(SearchContext);

	let pageButtons:(number|string)[] = [];

	if(totalPages <= 6){
		for(let i = 1; i <= totalPages; i++){
			pageButtons.push(i);
		}
	} else {
		if(page >= totalPages-3) pageButtons = [1, "...", totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages]
		else {
			if(page < 5) pageButtons = [1, 2, 3, 4, 5, "...", totalPages]
			else pageButtons = [1, "...", page-1, page, page+1,"...", totalPages]
		}
	}

	return (
		<div id="list-pagination" className="pagination-buttons" style={{display: totalPages < 2? "none" : "flex"}}>
			{pageButtons.map((p, index) => {
					return <button className={page === p? "current" : ""} key={index} id={`${index}`} value={p} disabled={page === p} onClick={changePage}>{p}</button>
				})}
		</div>
	)
}

interface ListProps {
	fromUserList?: boolean;
}

const List:React.FC<ListProps> = ({fromUserList}) => {
	smoothscroll.polyfill();

	const {reviews, loading, url, filters, page, totalPages, more, getReviews, isLoading, currentPage} = useContext(SearchContext);

	useEffect(() => {
		console.log("HIT?")
		if(reviews.length === 0 && !fromUserList){
			if(!loading) isLoading(true);
			getReviews(url, filters, page, true);
		}
	}, [])

	const changePage = (e:any) => {
		if(e.target.value === "..."){
			currentPage(e.target.id === '1'? page-3 : page+3)
		} else currentPage(parseInt(e.target.value))
		window.scrollTo({top: 400})
	}

	return(
		loading? <ReactLoading type={"spin"} color={"yellow"}/> : 
		<>
			<Pagination changePage={changePage}/>
			<ReviewList />
			<div id="list-pagination" className="pagination-arrows" style={{display: (totalPages < 2 || more)? "none" : "flex"}}>
				<button value={page-1} style={{visibility: page === 1? "hidden" : "visible"}} onClick={changePage}><FontAwesomeIcon style={{marginRight: '2px'}} icon={faAngleLeft} />Prev</button>
				<button value={page+1} style={{visibility: page === totalPages? "hidden" : "visible"}} onClick={changePage}>Next<FontAwesomeIcon style={{marginLeft: '2px'}} icon={faAngleRight} /></button>
			</div>
		</>
	)
}

export default List;