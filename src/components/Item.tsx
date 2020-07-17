import React from 'react';
import Review from '../utils/Review';

import '../styles/item.css';

const Item: React.FC<Review> = ({title, rating}) => {
    return(
        <li>
            <h4>{title}</h4>
            <h2>{rating}</h2>
        </li>
    )
}

export default Item;