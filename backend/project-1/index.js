const express = require('express');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const app = express();
app.use(express.json());



//its empty when we again startthe server , it act like in memory database
const urlDatabase = new Map();

const generateShorturl = () => {
    return uuidv4().substring(0, 8); 
};

const isValidShorturl = (code) => {
    return /^[a-zA-Z0-9_-]{4,20}$/.test(code); //it is used to check id url in 
};

const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

app.post('/shorturls', (req, res) => {
    try {
        const { url, validity, shortcode } = req.body;
        
        
        if (!url || !isValidUrl(url)) {
            return res.status(400).json({ 
                error: "url should not be empty"
            });
        }
        
        
        if (shortcode && urlDatabase.has(shortcode)) {
            return res.status(409).json({ 
                error: 'Shortcode already in use please give unique short code',
            });
        }
        
        
        const finalShortCode = shortcode || generateShortCode();
        const validityMinutes = validity || 30;
        const expiresAt = moment().add(validityMinutes, 'minutes').toISOString();
     
        urlDatabase.set(finalShortCode, {
            originalUrl: url,
            shortCode: finalShortCode,
            createdAt: new Date().toISOString(),
            expiresAt,
            hits: 0
        });
        
        res.status(201).json({
            shortLink: `http://${req.headers.host}/${finalShortCode}`,
            expiry: expiresAt
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Internal server error',
        });
    }
});

app.get('/:shortCode', (req, res) => {
    try {
        const { shortCode } = req.params;
        
        if (!urlDatabase.has(shortCode)) {
            return res.status(404).json({ 
                error: 'Short URL not found , specify correct url'
            });
        }
        
        const urlEntry = urlDatabase.get(shortCode);
        
        
        if (moment().isAfter(urlEntry.expiresAt)) {
            urlDatabase.delete(shortCode);
            return res.status(410).json({ 
                error: 'Short URL has expired create anothr short code if u want'
            });
        }
        
        
        urlEntry.hits++;
        urlDatabase.set(shortCode, urlEntry);
        
        
        res.redirect(301, urlEntry.originalUrl);
    } catch (error) {
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});


const PORT =  8000;
app.listen(PORT, () => {
   
    console.log(`URL Shortener service running on port ${PORT}`);
});