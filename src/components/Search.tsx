import React from 'react';

interface Props {
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
}

const Search: React.FC<Props> = ({query, setQuery}) => {
    return(
        <h1>Test</h1>
    )
}

export default Search;