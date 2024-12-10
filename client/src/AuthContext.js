// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [authState, setAuthState] = useState({
//     isAuthenticated: false,
//     loading: true,
//     user: null,
//   });

//   // Load auth state from localStorage on initial load
//   useEffect(() => {
//     const savedAuthState = JSON.parse(localStorage.getItem("authState"));
//     if (savedAuthState) {
//       setAuthState({ ...savedAuthState, loading: false });
//     } else {
//       setAuthState((prev) => ({ ...prev, loading: false }));
//     }
//   }, []);

//   // Update auth state and persist it in localStorage
//   const setAuth = (newState) => {
//     setAuthState((prev) => {
//       const updatedState = { ...prev, ...newState };
//       localStorage.setItem("authState", JSON.stringify(updatedState));
//       return updatedState;
//     });
//   };

//   return (
//     <AuthContext.Provider value={{ ...authState, setAuth }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    loading: true,
    user: null,
  });

  // Validate session and load auth state
  useEffect(() => {
    const validateSession = async () => {
      try {
        // Call the API to validate the user's session
        const response = await fetch("http://localhost:5000/api/check-auth", {
          credentials: "include", // Ensure cookies are sent
        });

        if (response.ok) {
          const data = await response.json();
          setAuthState({
            isAuthenticated: true,
            loading: false,
            user: data.user, // Set the user object from the API response
          });
        } else {
          setAuthState({ isAuthenticated: false, loading: false, user: null });
        }
      } catch (error) {
        console.error("Error validating session:", error);
        setAuthState({ isAuthenticated: false, loading: false, user: null });
      }
    };

    validateSession();
  }, []); // Run this effect only once on initial load

  // Update auth state and persist it in localStorage
  const setAuth = (newState) => {
    setAuthState((prev) => {
      const updatedState = { ...prev, ...newState };
      localStorage.setItem("authState", JSON.stringify(updatedState));
      return updatedState;
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
