const express = require('express')

const app = express();
app.use(express.json())
app.use(express.urlencoded())
app.get('/', (req, res) => {
    res.json({ run: 'run bot25 wjs' })
});
app.listen(process.env.PORT || 3000, () => { console.log(`listen`) })
