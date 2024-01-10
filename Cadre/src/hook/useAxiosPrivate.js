import { useEffect } from 'react';
import { axiosPrivate, axiosClient } from '../api/axios';
import auth from '../utils/auth';
import useRefreshToken from './useRefreshToken';
import { useNavigate } from 'react-router';

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const navigate = useNavigate();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers.authorization) {
          config.headers.authorization = `Bearer ${auth.getAccessToken()}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const prevRequest = error.config;
        if (error?.response?.status === 403) {
          const newAccessToken = await refresh();
          prevRequest.headers.authorization = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        if (error?.response?.status === 401) {
          const refresh_token = {
            refresh_token: auth.getRefreshToken(),
          };
          auth.logout();
          // LOGOUT
          axiosClient
            .post('auth/logout', refresh_token)
            .then((res) => {
              console.log(res);
              navigate('/');
            })
            .catch((error) => {
              console.log(error);
            });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.response.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;

