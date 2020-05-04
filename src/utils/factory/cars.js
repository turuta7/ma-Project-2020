const carFactory = ({ id = '', model = '', license = '' }) => {
  const cars = {
    id,
    model,
    license,
  };

  return cars;
};

module.exports = {
  carFactory,
};
