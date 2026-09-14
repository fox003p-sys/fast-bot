import React from 'react';

const AuthContext = React.createContext({
  signIn: async () => ({ success: false, error: 'Not implemented' }),
  signUp: async () => ({ success: false, error: 'Not implemented' }),
  signOut: async () => {},
  userToken: null,
  userSession: null,
});

export default AuthContext;
