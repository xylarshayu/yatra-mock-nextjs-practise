import Link from "next/link";

export default function Footer() {
  const GITHUB_LINK = "http://github.com/xylarshayu";
  const LINKEDIN_LINK = "https://www.linkedin.com/in/ayush-w-xylar/";

  return (
    <footer className="text-center bg-gray-200 shadow-md dark:bg-gray-800 shadow-black h-footer-height">
      <div className="flex items-center justify-between h-full px-4 mx-auto text-xs tracking-widest max-w-maxwidth font-uppercase">
        <span className="hidden md:inline">
          &copy; {new Date().getFullYear()} Find My Hotel
        </span>
        <span className="inline-flex items-center gap-2">
          <Link href={GITHUB_LINK} target="_blank" rel="noopener noreferrer">
            GitHub
          </Link>
          <span className="text-gray-500">|</span>
          <Link href={LINKEDIN_LINK} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </Link>
        </span>
      </div>
    </footer>
  );
}
