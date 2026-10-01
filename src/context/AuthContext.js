import React from 'react';

const AuthContext = React.createContext({
  signIn: async () => ({ success: true }),
  signUp: async () => ({ success: true }),
  signOut: async () => {},
  userToken: null,
  userSession: null,
});

export default AuthContext;
