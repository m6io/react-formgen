import { HiMiniSun, HiMiniMoon } from "react-icons/hi2";
import { SiYoutube, SiGithub } from "react-icons/si";
import { useTheme } from "./useTheme";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:border-neutral-700 dark:bg-neutral-900">
      <div className="flex h-16 items-center px-10 sm:px-16 lg:px-44">
        <div className="mx-auto w-full max-w-3xl space-y-20">
          <div className="flex justify-between">
            <div className="flex flex-1 items-center justify-start">
              <a
                className="inline-flex h-10 items-center justify-center text-lg font-bold text-gray-800 dark:text-white"
                href="/"
              >
                @m6oss/schema-form
              </a>
            </div>
            <div className="flex flex-1 items-center justify-end">
              <nav className="flex items-center space-x-1">
                <ThemeToggle />
                <a
                  href="https://www.youtube.com/@m6io"
                  target="_blank"
                  className="h-10 w-10 p-2 text-gray-800 hover:text-[#ff0000] dark:text-white dark:hover:text-[#ff0000]" // Brand color from https://brandcolors.net/b/youtube
                >
                  <SiYoutube className="h-full w-full" />
                </a>
                <a
                  href="https://github.com/m6io/schema-form"
                  target="_blank"
                  className="h-10 w-10 p-2 text-gray-800 hover:text-[#4078c0] dark:text-white dark:hover:text-[#4078c0]" // Brand color from https://brandcolors.net/b/github
                >
                  <SiGithub className="h-full w-full" />
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      className="h-10 w-10 p-2 text-gray-800 hover:text-amber-500 dark:text-white dark:hover:text-amber-400"
      onClick={() => toggleDarkMode()}
    >
      {isDarkMode ? (
        <HiMiniMoon className="h-full w-full" />
      ) : (
        <HiMiniSun className="h-full w-full" />
      )}
    </button>
  );
}
