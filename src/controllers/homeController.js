exports.index = (req, res) => {
  res.render('home', {
    title: 'Jemma | Sillas y confort',
    company: 'Jemma',
  });
};
