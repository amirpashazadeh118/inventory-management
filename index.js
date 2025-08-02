const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const cookieParser = require('cookie-parser');


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

let routes = require('./userRoutes').router;
app.use('', routes);

routes = require('./inventoryRoutes');
app.use('/inventory', routes);

routes = require('./partRoutes');
app.use('/parts', routes);

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

//TODO uncomment this code :

// app.use((req, res, next) => {
//   if (req.path.startsWith('/login')) {
//     return res.redirect('/login');
//   }
//   res.redirect('/login');
// });