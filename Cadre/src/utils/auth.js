const { localStorage } = global.window;

const auth = {
  login(data) {
    const { status, user_id, user_type, ward_id, district_id, token, refresh_token } = data;

    if (status === 'success') {
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('user_type', user_type);
      localStorage.setItem('ward_id', ward_id);
      localStorage.setItem('district_id', district_id);
      localStorage.setItem('token', token);
      localStorage.setItem('refresh_token', refresh_token);
    }
  },

  setUserId(user_id) {
    localStorage.user_id = user_id;
  },

  getUserId() {
    return localStorage.user_id;
  },

  setUserType(user_type) {
    localStorage.user_type = user_type;
  },

  getUserType() {
    return localStorage.user_type;
  },

  setWardId(ward_id) {
    localStorage.ward_id = ward_id;
  },

  getWardId() {
    return localStorage.ward_id;
  },

  setDistrictId(district_id) {
    localStorage.district_id = district_id;
  },

  getDistrictId() {
    return localStorage.district_id;
  },

  setAccessToken(token) {
    localStorage.token = token;
  },

  getAccessToken() {
    return localStorage.token;
  },

  setRefreshToken(refresh_token) {
    localStorage.refresh_token = refresh_token;
  },

  getRefreshToken() {
    return localStorage.refresh_token;
  },

  logout() {
    localStorage.clear();
  },
};

export default auth;

