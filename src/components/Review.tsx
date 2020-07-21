import React, {useState, useEffect} from 'react';
import {useParams, Redirect} from 'react-router-dom';
import request from '../utils/makeRequest';
import Review from '../utils/Review';
import handleTitle from '../utils/handleTitle';
import ReactLoading from 'react-loading';

interface ReviewInfoProps {
    review: Review;
}

const ReviewInfo: React.FC<ReviewInfoProps> = ({review}) => {
    return(
        !review.director? <Redirect push to="/" /> :
        <>
            <h2>{review.movie}</h2>
            <img style={{maxWidth: '300px'}} src={review.poster} alt="POSTER" />
            <div id="review-card">
                <h2>Score: {review.total} (#{review.rank})</h2>
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
                const {movie} = res.data
                if(movie.substring(movie.length-5).toLowerCase() === ", the") res.data.movie = handleTitle(movie);
                setReview(res.data);
            }
            setLoading(false);
        })
    }, [rank])

    return(
        <div id="reviewPage">
            {loading? <ReactLoading className="reviewPage-loading" type={"spin"} color={"yellow"} width={'25%'}/> : <ReviewInfo review={review} />}
        </div>
    )
}

export default ReviewPage;