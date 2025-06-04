// backend.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/check-cookie', async (req, res) => {
    const cookie = req.body.cookie;

    if (!cookie) {
        return res.status(400).json({ error: 'Cookie is required' });
    }

    try {
        const response = await fetch('https://roblox.com/home', {
            headers: {
                'Cookie': cookie,
                'User-Agent': 'Mozilla/5.0',
            },
            redirect: 'manual' // para malaman kung saan magre-redirect
        });

        // Roblox usually redirects to /login if cookie invalid
        if (response.status === 302 || response.status === 301) {
            const location = response.headers.get('location');
            if (location && location.includes('/login')) {
                return res.json({ valid: false, message: 'Invalid cookie, please check' });
            }
        }

        // If no redirect to login, consider cookie valid
        return res.json({ valid: true, message: 'Cookie valid!' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error checking cookie' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
