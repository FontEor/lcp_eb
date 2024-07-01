const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,

  aesKey: (state) => state.aes.aesKey,
  aesIv: (state) => state.aes.aesIv,

  routerBeforeEachNextParams: (state) => state.user.routerBeforeEachNextParams,
  token: (state) => state.user.token,
  headImg: (state) => state.user.headImg,
  name: (state) => state.user.name,
  user_pin: (state) => state.user.user_pin,
  user_develop: (state) => state.user.user_develop,
  loginState: (state) => state.user.loginState,
  msgCount: (state) => state.user.msgCount,

  menus: (state) => state.app.menus,
};
export default getters;
