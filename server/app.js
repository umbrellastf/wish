const express = require('express');
const ehb = require('express-handlebars');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const app = express();

app.use(express.static(`${__dirname}/../static`));

app.engine('handlebars', ehb.engine({ defaultLayout: '' }));

app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);

app.get("/{*splat}", (req, res) => {
    return res.render('index');
});

app.listen(port, (err) => {

    if (err) { throw err; }

    console.log(`http://localhost:${port}`);
});