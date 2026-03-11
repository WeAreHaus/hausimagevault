const CREDENTIALS = { email: "johan@haus.se", password: "jochen" };
const STORAGE_KEY = "dam-auth";

function isAuthenticated(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export const authStore = {
  isAuthenticated,

  login(email: string, password: string): boolean {
    if (email === CREDENTIALS.email && password === CREDENTIALS.password) {
      localStorage.setItem(STORAGE_KEY, "true");
      return true;
    }
    return false;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY);
  },
};
