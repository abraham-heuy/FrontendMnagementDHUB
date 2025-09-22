
// src/utils/api.ts
const API_URL = import.meta.env.VITE_API_URL as string;

export const loginAdmin = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    let errorMsg = "Something went wrong. Please try again later.";

    if (!response.ok) {
      //parse the backend error safely: Tip => {I have used general messaging to avoid user getting direct erroor msg from backend}
      try {
        const error = await response.json();
        errorMsg = error.message || "Invalid email or password.";
      } catch {
        if (response.status === 401) {
          errorMsg = "Invalid email or password.";
        }
      }

      throw new Error(errorMsg);
    }

    return response.json();
  } catch (err) {
    // check for Network issue (server down, no internet, etc.)
    if (err instanceof TypeError) {
      throw new Error("Unable to connect. Please try again later.");
    }
    throw err;
  }
};


export const fetchMe = async () => {
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("fetchMe error:", err);
    return null;
  }
};


export const logoutAdmin = async ()=>{
  //catch exceptions
  try {
    const response = await fetch(`${API_URL}/auth/logout`,{
      method: "POST",
      credentials: "include", //always include this dude, or you'll sweat
    })
    if(!response.ok){
      throw new Error("Logout failed. Please try again!")
    }
    return response.json()
    
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error("Network error. Please try again later.");
    }
    throw err;
  }
}