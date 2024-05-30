import axios from 'axios';
import React, { useState } from 'react'

const Search = () => {

    const [userChoice, setUserChoice] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [format, setFormat] = useState("json");

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:7777/googleSearch`, {
                params: { q: userChoice }
            });
            setResults(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleExport = async () => {
        try {
            const response = await axios.get(`http://localhost:7777/exportResults`, {
                params: { q: userChoice, format },
                responseType: 'blob' 
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `google_search_results_${Date.now()}.${format}`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <input 
                type='text'
                placeholder='Search...'
                value={userChoice}
                onChange={(e) => setUserChoice(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
            </select>
            <button onClick={handleExport}>Export</button>

            <div>
                {
                    results.map((result, index) => (
                        <div key={index}>
                            <h3>{result.title}</h3>
                            <p>{result.snippet}</p>
                            <a href={result.link}>{result.displayed_link}</a>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Search;
