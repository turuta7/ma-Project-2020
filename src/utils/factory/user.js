const UserFactory = ({
  id,
  token = '',
  email = '',
  fullname = '',
  homeAddress = '',
  workAddress = '',
  homeLatitude = 0,
  homeLongitude = 0,
  workLatitude = 0,
  workLongitude = 0,
}) => {
  const user = {
    id,
    email,
    fullname,
    homeAddress,
    homeLocation: [Number(homeLatitude), Number(homeLongitude)],
    workAddress,
    workLocation: [Number(workLatitude), Number(workLongitude)],
  };

  if (token) {
    user.token = token;
  }

  return user;
};

const UserSchemeFactory = ({
  email,
  fullname = '',
  homeAddress = '',
  homeLocation = [0, 0],
  workAddress = '',
  workLocation = [0, 0],
}) => {
  const user = {
    email,
    fullname,
    homeAddress,
    homeLatitude: homeLocation[0],
    homeLongitude: homeLocation[1],
    workAddress,
    workLatitude: workLocation[0],
    workLongitude: workLocation[1],
  };

  return user;
};

module.exports = {
  UserFactory,
  UserSchemeFactory,
};
