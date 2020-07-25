import React, {useState, useEffect} from 'react';
import {useParams, Redirect} from 'react-router-dom';
import request from '../utils/makeRequest';
import Review from '../utils/Review';
import handleTitle from '../utils/handleTitle';
import ReactLoading from 'react-loading';

interface ReviewInfoProps {
    review: Review;
}

// style={{fontSize: review.movie.length < 12 ? "2em" : ""}
const ReviewInfo: React.FC<ReviewInfoProps> = ({review}) => {
    return(
        !review.director? <Redirect push to="/" /> :
        <>
            <h2 id="reviewPage-title">{review.movie}</h2>
            <h1 id="review-rank">Rank: #{review.rank}</h1>
            <img id="review-poster" style={{maxWidth: '300px'}} src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${review.poster}`} alt="POSTER" />
            <div id="review-card">
                <h1 id="review-total">Score: {review.total}/100</h1>
                <div id="review-streaming">
                    <h3>Streaming</h3>
                    <hr />
                    <div style={{color: "gray"}}>
                        {"{{Streaming Options Will Go Here}}"}
                    </div>
                </div>
                <table id="review-info">
                    <tbody>
                        <tr>
                            <td>Director:</td>
                            <td>{review.director}</td>
                        </tr>
                        <tr>
                            <td>Year Released:</td>
                            <td>{review.year}</td>
                        </tr>
                        <tr>
                            <td>Genre:</td>
                            <td>{review.genre}</td>
                        </tr>
                        <tr>
                            <td>Sub-Genre:</td>
                            <td>{review.subgenre || "N/A"}</td>
                        </tr>
                        <tr>
                            <td>Universe:</td>
                            <td>{review.universe || "N/A"}</td>
                        </tr>
                        <tr>
                            <td>Sub-Universe:</td>
                            <td>{review.subuniverse || "N/A"}</td>
                        </tr>
                        <tr>
                            <td>Character:</td>
                            <td>{review.character || "N/A"}</td>
                        </tr>
                        <tr>
                            <td>Sport/Holiday:</td>
                            <td>{review.sportholiday || "N/A"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

const ReviewPage: React.FC = (props) => {

    const {rank} = useParams();
    const[loading, setLoading] = useState<boolean>(true);
    const [review, setReview] = useState<Review>({
        movie: "",
        total: -1
    })

    useEffect(() => {
        request(`reviews/movie/${rank}`)
        .then((res: any) => {
            if(!res.data) {
                alert("No Movie Found!")
            } else {
                const {movie} = res.data[0]
                if(movie.substring(movie.length-5).toLowerCase() === ", the") res.data[0].movie = handleTitle(movie);
                console.log(res.data)
                setReview(res.data[0]);
            }
            setLoading(false);
        })
    }, [rank])

    return(
        <div id="reviewPage">
            {loading? <ReactLoading className="reviewPage-loading" type={"spin"} color={"yellow"} height={"10vh"} width={"10vh"}/> : <ReviewInfo review={review} />}
        </div>
    )
}

export default ReviewPage;