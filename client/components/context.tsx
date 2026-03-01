import { storage } from "@/services/storage";
import {
  AuthContextType,
  CalendarView,
  FamilyProfileObjs,
  JwtTokenObj,
} from "@/utility/types";
import { createContext, ReactNode, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextType>({
  jwtToken: null,
  setJwtToken: () => {},

  familyProfiles: null,
  setFamilyProfiles: () => {},

  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [jwtToken, setJwtToken] = useState<JwtTokenObj | null>(null);
  const [familyProfiles, setFamilyProfiles] =
    useState<FamilyProfileObjs | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydrateContext = async () => {
      try {
        const [storedJwt, storedProfiles, storeCalendarType] =
          await Promise.all([
            storage.getSecure("jwt_token"),
            storage.get("profiles"),
            storage.get("calendar_type"),
          ]);
        if (storedJwt) setJwtToken(storedJwt);
        if (storedProfiles) setFamilyProfiles(storedProfiles);
      } catch (err: any) {
        console.log("error as fuck: ", err.message);
      } finally {
        setIsHydrated(true);
      }
    };
    hydrateContext();
  }, []);

  const logout = () => {
    try {
      console.log("logoutstart")
      // 1. clears global context state
      setJwtToken(null);
      setFamilyProfiles(null);

      // 2. clears persistent storage
      storage.removeSecure("jwt_token")
      storage.remove("profiles")
      storage.remove("calendar_type")
      storage.remove("access_tokens") // From your previous code snippet

    } catch (err: any) {
      console.error("Logout failed: ", err.message);
    }
  };

  if (!isHydrated) return null;

  return (
    <AuthContext.Provider
      value={{
        jwtToken,
        setJwtToken,
        familyProfiles,
        setFamilyProfiles,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
