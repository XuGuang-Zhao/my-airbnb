const reducer = (state, action) => {
  switch (action.type) {
    case 'token':
      return {
        ...state,
        token: action.token,
      };
    default:
      throw new Error();
  }
}

export default reducer;
