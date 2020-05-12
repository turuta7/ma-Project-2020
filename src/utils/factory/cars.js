const carFactory = ({ id, model = '', license = '' }) => {
  const cars = {
    id: Number(id),
    model,
    license,
  };

  return cars;
};

module.exports = {
  carFactory,
};
