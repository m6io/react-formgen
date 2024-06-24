import { useState, useEffect } from "react";

// The useTheme custom hook for managing the theme using an on/off toggle
export const useTheme = (storageKey = "vite-ui-theme") => {
  // useState to hold the current theme state. It initializes the state based on the user's saved preference in localStorage, or defaults to the system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem(storageKey) // Check if a theme preference is saved in localStorage (after first visit)
      ? localStorage.getItem(storageKey) === "true" // Return true if saved preference is 'true', otherwise false
      : window.matchMedia("(prefers-color-scheme: dark)").matches; // If no saved preference (a.k.a. this is the user's first visit), use system preference
  });

  // useEffect hook to apply changes whenever the theme state changes
  useEffect(() => {
    const root = window.document.documentElement; // Access the root element of the document
    root.classList.remove("light", "dark"); // Remove any existing theme classes
    root.classList.add(isDarkMode ? "dark" : "light"); // Add the current theme class based on isDarkMode state
    localStorage.setItem(storageKey, isDarkMode.toString()); // Save the current theme preference to localStorage
  }, [isDarkMode, storageKey]); // Dependencies array, effect runs when these values change

  // Function to toggle the theme state
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode); // Set the isDarkMode state to the opposite of its current value

  // Return the theme state and the toggle function from the hook
  return { isDarkMode, toggleDarkMode };
};
