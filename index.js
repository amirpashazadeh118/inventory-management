const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Static Angular files
app.use(express.static(path.join(__dirname, 'client/dist/client')));

// Routes
let routes = require('./userRoutes').router;
app.use('', routes);

routes = require('./inventoryRoutes');
app.use('/inventory', routes);

// Example API route
// (Optional: remove this if not needed or move inside existing routes)
// app.use('/api', require('./routes/api'));

// EJS views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Catch-all route to serve Angular app
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/dist/client/index.html'));
// });

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


//TODO uncomment this code :

// app.use((req, res, next) => {
//   if (req.path.startsWith('/login')) {
//     return res.redirect('/login');
//   }
//   res.redirect('/login');
// });