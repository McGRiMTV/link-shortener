require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const session = require('express-session');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.locals.siteVersion = Date.now();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('trust proxy', 1);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

const requireAuth = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/');
    }
};

const RESERVED_WORDS = ['dashboard', 'logout', 'login', 'shorten', 'delete', 'style.css', 'admin', 'api'];

app.get('/', (req, res) => {
    if (req.session.loggedIn) return res.redirect('/dashboard');
    res.render('login', { error: null });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
        req.session.loggedIn = true;
        res.redirect('/dashboard');
    } else {
        res.render('login', { error: 'Invalid credentials' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/dashboard', requireAuth, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM links ORDER BY created_at DESC');
        
        let errorMessage = null;
        if (req.query.error === 'reserved') errorMessage = "That custom name is reserved and cannot be used.";
        if (req.query.error === 'exists') errorMessage = "That custom name is already in use.";

        res.render('dashboard', { 
            links: result.rows, 
            domain: 'go.madebyatlas.dev',
            error: errorMessage
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});

app.post('/delete/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM links WHERE id = $1', [id]);
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting link');
    }
});

app.post('/edit/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const { long_url, is_protected, password } = req.body;
    const isProtectedBool = is_protected === 'on';

    try {
        await pool.query(
            'UPDATE links SET long_url = $1, is_protected = $2, password = $3 WHERE id = $4',
            [long_url.trim(), isProtectedBool, isProtectedBool ? password : null, id]
        );
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard?error=exists');
    }
});

app.post('/shorten', requireAuth, async (req, res) => {
    const { long_url, custom_name, is_protected, password } = req.body;
    
    if (!long_url || !custom_name) return res.redirect('/dashboard');
    const normalizedName = custom_name.trim().toLowerCase();

    if (RESERVED_WORDS.includes(normalizedName)) {
        return res.redirect('/dashboard?error=reserved');
    }

    const isProtectedBool = is_protected === 'on';

    try {
        await pool.query(
            'INSERT INTO links (short_code, long_url, is_protected, password) VALUES ($1, $2, $3, $4)',
            [normalizedName, long_url.trim(), isProtectedBool, isProtectedBool ? password : null]
        );
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard?error=exists');
    }
});

app.get('/:code', async (req, res) => {
    const { code } = req.params;
    try {
        const result = await pool.query('SELECT * FROM links WHERE short_code = $1', [code]);
        if (result.rows.length > 0) {
            const link = result.rows[0];
            
            if (link.is_protected) {
                return res.render('password', { code: link.short_code, error: null });
            } else {
                pool.query('UPDATE links SET clicks = clicks + 1 WHERE short_code = $1', [code]);
                return res.redirect(link.long_url);
            }
        } else {
            return res.status(404).send('Link not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.post('/:code/unlock', async (req, res) => {
    const { code } = req.params;
    const { password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM links WHERE short_code = $1', [code]);
        if (result.rows.length > 0) {
            const link = result.rows[0];
            
            if (link.is_protected && link.password === password) {
                pool.query('UPDATE links SET clicks = clicks + 1 WHERE short_code = $1', [code]);
                return res.redirect(link.long_url);
            } else {
                return res.render('password', { code: link.short_code, error: 'Incorrect password. Try again.' });
            }
        } else {
            return res.status(404).send('Link not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Link shortener listening on port ${port}`);
});