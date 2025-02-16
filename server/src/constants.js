export const DB_NAME = "blogsphere";

export const UserRolesEnum = {
  USER: "USER",
  ADMIN: "ADMIN",
};

export const AvailableUserRoles = Object.values(UserRolesEnum);

export const UserGenderEnum = {
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
