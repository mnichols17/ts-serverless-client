import React, {useState, useEffect, useContext} from 'react';
import {useParams, Redirect} from 'react-router-dom';
import request from '../utils/makeRequest';
import Review from '../utils/Review';
import handleTitle from '../utils/handleTitle';
import ReactLoading from 'react-loading';
import ReactPlayer from 'react-player/youtube';
import {SearchContext} from '../utils/context';

interface ReviewInfoProps {
    review: Review;
    providers: object[];
    fromCategory: (category: string, value: string) => void
}

interface ProviderLogosProps {
    providers: object[];
}

const ProviderLogos: React.FC<ProviderLogosProps> = ({providers}) => {
    const main:number[] = [8,15,9,337,384,27,386,387,78,350,43]
    let logos:any[] = [];
    providers.forEach((provider:any) => {
        const logo = <a target="_blank" rel="noopener noreferrer" href={provider.url} key={provider.provider_id}>
                        <img className="provider" src={require(`../media/providers/${provider.provider_id}.png`)} alt={provider.provider_id}/>
                    </a>

        main.includes(parseInt(provider.provider_id))? logos.push(logo) : logos.unshift(logo);
    })
    return (
        <div id="review-streaming">
            <h3 id="streaming-title" className="title-font">Streaming Options</h3>
            <hr />
            {providers.length? <><p>Click to Watch</p>
            <div style={{display: 'flex', justifyContent: 'center', flexWrap: "wrap"}}>
                {logos.slice().reverse().map(l => l)}
            </div></> : <h2>No Streaming Options Available</h2>}
        </div>
    )
}

const ReviewInfo: React.FC<ReviewInfoProps> = ({review, providers, fromCategory}) => {
    return(
        !review.director? <Redirect push to="/" /> :
        <>
            <h2 id="reviewPage-title">{review.movie}</h2>
            <h1 id="review-rank" className="title-font">Rank: #{review.rank}</h1>
            <img id="review-poster" src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${review.poster}`} alt="POSTER" />
            <div id="review-card">
                <h1 id="review-total" className="title-font">Score: {review.total}/100</h1>
                <p id="review-plot">{review.plot}</p>
                <h3 className="review-detail title-font">Director</h3>
                <p className="review-people">{review.director}</p>
                <h3 className="review-detail title-font">Starring</h3>
                <p className="review-people">{review.actors}</p>
                <h3 className="review-detail title-font">Awards</h3>
                {(review.oscars || review.goldenglobes)? <><p className="review-people">{review.oscars? `${review.oscars} at The Oscars` : null}</p>
                <p className="review-people">{review.goldenglobes? `${review.goldenglobes} at The Golden Globes` : null}</p></> : 
                <p className="review-people">N/A</p>}
                <ProviderLogos providers={providers} />
                <div id="review-trailer-wrapper">
                    <ReactPlayer className="react-player" url={`https://www.youtube.com/watch?v=${review.video_key}`} height="100%" width="100%" controls={true}/>
                </div>
            </div>
            <table id="review-info">
                <tbody>
                    <tr>
                        <td>Year Released:</td>
                        <td>{review.year}</td>
                    </tr>
                    <tr>
                        <td>Runtime:</td>
                        <td>{review.runtime} minutes</td>
                    </tr>
                    <tr>
                        <td>Genre:</td>
                        {/* <td onClick={() => fromCategory('genres', review.genre as string)}>{review.genre || "N/A"}</td> */}
                        <td>{review.genre? <button className="review-info-button" onClick={() => fromCategory('genres', review.genre as string)}>{review.genre}</button> : "N/A"}</td>

                    </tr>
                    <tr>
                        <td>Sub-Genre:</td>
                        {/* <td onClick={() => fromCategory('subGenres', review.subgenre as string)}>{review.subgenre || "N/A"}</td> */}
                        <td>{review.subgenre? <button className="review-info-button" onClick={() => fromCategory('subGenres', review.subgenre as string)}>{review.subgenre}</button> : "N/A"}</td>
                    </tr>
                    <tr>
                        <td>Studio/Company:</td>
                        {/* <td onClick={() => fromCategory('studiocompanies', review.studiocompany as string)}>{review.studiocompany || "N/A"}</td> */}
                        <td>{review.studiocompany? <button className="review-info-button" onClick={() => fromCategory('studiocompanies', review.studiocompany as string)}>{review.studiocompany}</button> : "N/A"}</td>

                    </tr>
                    <tr>
                        <td>Universe:</td>
                        {/* <td onClick={() => fromCategory('universes', review.universe as string)}>{review.universe || "N/A"}</td> */}
                        <td>{review.universe? <button className="review-info-button" onClick={() => fromCategory('universes', review.universe as string)}>{review.universe}</button> : "N/A"}</td>
                    </tr>
                    <tr>
                        <td>Sub-Universe:</td>
                        {/* <td onClick={() => fromCategory('subUniverses', review.subuniverse as string)}>{review.subuniverse || "N/A"}</td> */}
                        <td>{review.subuniverse? <button className="review-info-button" onClick={() => fromCategory('subUniverses', review.subuniverse as string)}>{review.subuniverse}</button> : "N/A"}</td>
                    </tr>
                    <tr>
                        <td>Character:</td>
                        {/* <td onClick={() => fromCategory('characters', review.character as string)}>{review.character || "N/A"}</td> */}
                        <td>{review.character? <button className="review-info-button" onClick={() => fromCategory('characters', review.character as string)}>{review.character}</button> : "N/A"}</td>
                    </tr>
                    <tr>
                        <td>Sport/Holiday:</td>
                        {/* <td onClick={() => fromCategory('sportholidays', review.sportholiday as string)}>{review.sportholiday || "N/A"}</td> */}
                        <td>{review.sportholiday? <button className="review-info-button" onClick={() => fromCategory('sportholidays', review.sportholiday as string)}>{review.sportholiday}</button> : "N/A"}</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

const ReviewPage: React.FC = (props:any) => {

    const {rank} = useParams();
    const {currentView, currentUrl, currentQuery ,currentFilters} = useContext(SearchContext);
    
    const[loading, setLoading] = useState<boolean>(true);
    const[review, setReview] = useState<Review>({
        movie: "",
        total: -1
    })
    const[providers, setProviders] = useState<object[]>([])

    useEffect(() => {
        request(`reviews/movie/${rank}`)
        .then((res: any) => {
            if(!res.data) {
                alert("No Movie Found!")
            } else {
                const {movie} = res.data[0]
                if(movie.substring(movie.length-5).toLowerCase() === ", the") res.data[0].movie = handleTitle(movie);
                setReview(res.data[0]);
                setProviders(res.data[1]);
            }
            setLoading(false);
        })
    }, [rank])

    const fromCategory = (category: string, value: string) => {
        const filterReset = {
            directors: [],
            sort: {
                value: "ASC",
                label: "Rating High to Low"
            },
            genres: [],
            subGenres: [],
            universes: [],
            subUniverses: [],
            studiocompanies: [],
            characters: [],
            sportholidays: [],
            years: [],
            decades: [],
            providers: [],
            oscars: [],
            goldenglobes: []
        }
        currentView(true);
        currentUrl('reviews/all')
        currentQuery('')
        currentFilters({
            ...filterReset,
            [category]: [{value, label: value}]
        })
        props.history.push('/');
    }

    return(
        <div id="reviewPage">
            {loading? <ReactLoading className="reviewPage-loading" type={"spin"} color={"yellow"} height={"10vh"} width={"10vh"}/> : <ReviewInfo review={review} providers={providers} fromCategory={fromCategory} />}
        </div>
    )
}

export default ReviewPage;