export const DB_NAME = "blogsphere-college";

export const UserGenderEnum = {
  NULL: "",
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
};

export const AvailableUserGender = Object.values(UserGenderEnum);

export const cookieOption = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
};
