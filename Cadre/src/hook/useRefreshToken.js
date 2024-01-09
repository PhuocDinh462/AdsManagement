import { axiosPrivate } from '../api/axios';
import auth from '../utils/auth';

const useRefreshToken = () => {
  const refresh = async () => {
    const response = await axiosPrivate.post('/auth/refresh_token', { refresh_token: auth.getRefreshToken() });

    auth.setAccessToken(response.data.access_token);
    console.log(response.data.access_token);
    return response.data.access_token;
  };

  return refresh;
};

export default useRefreshToken;

