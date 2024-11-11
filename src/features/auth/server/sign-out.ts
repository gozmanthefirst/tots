// Local Imports
import { signOut as signout } from "@/shared/lib/auth/auth-client";

export const signOut = async () => {
  try {
    await signout();
    window.location.href = "/sign-in";
  } catch (error) {
    console.log(error);
  }
};
