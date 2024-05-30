
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import json2csv from "json2csv";
import { createWriteStream } from "fs";
import fs from "fs";

const app = express();
const PORT = 7777;

app.use(cors());

app.get('/googleSearch', async (req, res) => {
    const { q, format } = req.query;
    const apiUrl = `https://serpapi.com/search.json?q=${q}&api_key=a30a0992face506b2050c3823f6a66dda2de5b03a58c24b5d5de8183d659b0ec`;

    try {
        const response = await fetch(apiUrl);
        const data: any = await response.json();

        if (format === 'csv') {
            const csv = json2csv.parse(data.organic_results);
            const filePath = `results_${Date.now()}.csv`;
            const fileStream = createWriteStream(filePath);
            fileStream.write(csv);
            fileStream.end();
            res.download(filePath, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    fs.unlinkSync(filePath);
                }
            });
        } else {
            res.json(data.organic_results);
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});