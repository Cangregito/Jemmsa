const path = require('path');
const express = require('express');
const app = express();

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes
const indexRouter = require('./routes');
app.use('/', indexRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página no encontrada | Jemma' });
});

// Server
if (require.main === module) {
  app.listen(app.get('port'), () => {
    console.log(`Jemma app listening on http://localhost:${app.get('port')}`);
  });
}

module.exports = app;
