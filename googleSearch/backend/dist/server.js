var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import fs from "fs";
const app = express();
const PORT = 7777;
app.use(cors());
app.get('/googleSearch', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { q } = req.query;
    const apiUrl = `https://serpapi.com/search.json?q=${q}&api_key=a30a0992face506b2050c3823f6a66dda2de5b03a58c24b5d5de8183d659b0ec`;
    try {
        const response = yield fetch(apiUrl);
        const data = yield response.json();
        res.json(data.organic_results);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
app.get('/exportResults', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { q } = req.query;
    const apiUrl = `https://serpapi.com/search.json?q=${q}&api_key=a30a0992face506b2050c3823f6a66dda2de5b03a58c24b5d5de8183d659b0ec`;
    try {
        const response = yield fetch(apiUrl);
        const data = yield response.json();
        const fileName = `googleResults${Date.now()}.json`;
        fs.writeFileSync(fileName, JSON.stringify(data.organic_results));
        res.download(fileName);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// app.get('/exportResults', async (req, res) => {
//     const { q } = req.query;
//     const apiUrl = `https://serpapi.com/search.json?q=${q}&api_key=a30a0992face506b2050c3823f6a66dda2de5b03a58c24b5d5de8183d659b0ec`;
//     try {
//         const response = await fetch(apiUrl);
//         const data: any = await response.json();
//         const fileName = `google_search_results_${Date.now()}.json`;
//         const filePath = path.join(__dirname, fileName);
//         fs.writeFileSync(filePath, JSON.stringify(data.organic_results));
//         res.download(filePath, (err) => {
//             if (err) {
//                 console.error(err);
//                 res.status(500).json({ error: 'File download error' });
//             } else {
//                 fs.unlinkSync(filePath);
//             }
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' })
//     }
// });
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
