import axios from 'axios';
import { getEnvVariables } from '../helpers/getEnvVariables';
import { LoginUserType, LoginUserResponse, User } from '../types/user';

const { VITE_API_URL } = getEnvVariables();

const instagramApi = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: true,
});

export const loginUser = async ({ identifier, password }: LoginUserType) => {
  const { data } = await instagramApi.post<LoginUserResponse>('/users/login', {
    identifier,
    password,
  });
  return data;
};

export const getCurrentUser = async () => {
  const user = await instagramApi.get<User>('/users/me');

  return user;
};

export default instagramApi;
