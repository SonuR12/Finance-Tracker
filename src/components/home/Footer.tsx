import React from "react";
import { Mail, Github, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full flex flex-col sm:flex-row justify-between border-t border-gray-700 dark:border-white/20 py-3 px-6 bg-gradient-to-r from-gray-900 via-indigo-950 to-indigo-800 dark:from-neutral-900 dark:to-neutral-800">
      <div className="max-w-6xl py-3 mx-auto ml-0 flex flex-col sm:flex-row justify-between items-center text-sm text-neutral-200 dark:text-neutral-300">
        <div className="mb-4 sm:mb-0 text-center sm:text-left">
          © {new Date().getFullYear()} Sonu Rai — Full Stack Developer{" "}
          <br className="sm:hidden" />
          Blending functionality with beautiful UI to build seamless digital
          experiences.
        </div>
      </div>

      <div className="flex gap-2 md:gap-4 sm:justify-between items-center mx-auto sm:mx-0 pb-2 sm:pb-0">
        <Link href="mailto:sonurai272004@gmail.com" className="flex items-center gap-1 hover:underline">
          <Image height={25} width={25} alt="mail" src={'/svg/gmail.svg'}/>
        </Link>
        <Link href="https://github.com/SonuR12" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
        <Image height={23} width={23} alt="github" src={'/svg/github_logo_dark.svg'}/>

        </Link>
        <Link href="https://www.linkedin.com/in/sonu-rai-55473a289/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
        <Image height={30} width={30} alt="linkdin" src={'/svg/linkdin.svg'}/>
        </Link>
      </div>
    </footer>
  );
}
