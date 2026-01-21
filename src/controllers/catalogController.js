const chairs = require('../data/chairs');

exports.index = (req, res) => {
  res.render('catalog', {
    title: 'Catálogo | Jemmsa',
    chairs,
  });
};
