import React from 'react';

const AuthContext = React.createContext({
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export default AuthContext;
