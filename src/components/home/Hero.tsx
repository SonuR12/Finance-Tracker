"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useT } from "@/lib/i18n-context";

export default function Hero() {
  const imageRef = useRef<HTMLDivElement>(null);
  const t = useT();

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement?.classList.add("image-animate");
      } else {
        imageElement?.classList.remove("image-animate");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll); // ✅ Corrected
  }, []);

  return (
    <div className="relative my-10 flex w-full flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Full-screen Edge Borders */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Top Border */}
        <div className="absolute top-0 left-0 w-full h-px bg-neutral-200 dark:bg-neutral-800">
          <div className="mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>

        {/* Bottom Border */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-neutral-200 dark:bg-neutral-800">
          <div className="mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>

        {/* Left Border */}
        <div className="absolute top-0 left-0 h-full w-px bg-neutral-200 dark:bg-neutral-800">
          <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>

        {/* Right Border */}
        <div className="absolute top-0 right-0 h-full w-px bg-neutral-200 dark:bg-neutral-800">
          <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>
      </div>

      {/* Hero Content */}
      <div className="z-10 px-4 py-5 sm:py-10 md:py-20 text-center space-y-6">
        <h1 className="mx-auto max-w-3xl text-3xl font-bold md:text-5xl lg:text-6xl relative">
          {t("hero.title").split(" ").map((word: string, index: number) => (
            <React.Fragment key={index}>
              {word === "Powered" && <br />}
              <motion.span
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block gradient-title bg-clip-text pb-2"
              >
                {word}
              </motion.span>
            </React.Fragment>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mx-auto max-w-2xl text-lg text-neutral-500 dark:text-neutral-400"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Button asChild
            size="lg"
            className="button-gradient text-white group self-center px-8 py-6 text-base rounded-full"
          >
            <Link href="/dashboard">{t("hero.cta")}
            <Image
                width={20}
                height={20}
                src="/svg/arrow_right_icon.svg"
                alt="Arrow right"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex items-center justify-center gradient-title bg-clip-text px-8 py-6 text-base rounded-full"
          >
            {t("hero.demo")}
          </Button>
        </motion.div>
      </div>

      {/* Hero Image */}

      <div className="heroimage-wrapper">
        <motion.div
          ref={imageRef}
          // initial={{ opacity: 0, y: 20 }}
          // animate={{ opacity: 1, y: 0 }}
          // transition={{ duration: 0.6, delay: 1.3 }}
          className="relative heroimage w-[90vw] min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[720px] overflow-hidden rounded-xl border-y border-neutral-300 dark:border-neutral-700 drop-shadow-2xl"
        >
          <Image
            src="/Images/hero.jpeg"
            alt="Hero Image"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </div>
    </div>
  );
}

// "use client";

// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion";
// import React from "react";
// import { MacbookScroll } from "@/components/ui/macbook-scroll";

// // Peerlist Badge component
// const Badge = ({ className }: { className?: string }) => {
//   return (
//     <svg
//       width="24"
//       height="24"
//       viewBox="0 0 56 56"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       className={className}
//     >
//       <path
//         d="M56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28Z"
//         fill="#00AA45"
//       ></path>
//       <path
//         fillRule="evenodd"
//         clipRule="evenodd"
//         d="M28 54C42.3594 54 54 42.3594 54 28C54 13.6406 42.3594 2 28 2C13.6406 2 2 13.6406 2 28C2 42.3594 13.6406 54 28 54ZM28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z"
//         fill="#219653"
//       ></path>
//       <path
//         fillRule="evenodd"
//         clipRule="evenodd"
//         d="M27.0769 12H15V46H24.3846V38.8889H27.0769C34.7305 38.8889 41 32.9048 41 25.4444C41 17.984 34.7305 12 27.0769 12ZM24.3846 29.7778V21.1111H27.0769C29.6194 21.1111 31.6154 23.0864 31.6154 25.4444C31.6154 27.8024 29.6194 29.7778 27.0769 29.7778H24.3846Z"
//         fill="#24292E"
//       ></path>
//       <path
//         fillRule="evenodd"
//         clipRule="evenodd"
//         d="M18 11H29.0769C36.2141 11 42 16.5716 42 23.4444C42 30.3173 36.2141 35.8889 29.0769 35.8889H25.3846V43H18V11ZM25.3846 28.7778H29.0769C32.1357 28.7778 34.6154 26.39 34.6154 23.4444C34.6154 20.4989 32.1357 18.1111 29.0769 18.1111H25.3846V28.7778Z"
//         fill="white"
//       ></path>
//       <path
//         fillRule="evenodd"
//         clipRule="evenodd"
//         d="M17 10H29.0769C36.7305 10 43 15.984 43 23.4444C43 30.9048 36.7305 36.8889 29.0769 36.8889H26.3846V44H17V10ZM19 12V42H24.3846V34.8889H29.0769C35.6978 34.8889 41 29.7298 41 23.4444C41 17.1591 35.6978 12 29.0769 12H19ZM24.3846 17.1111H29.0769C32.6521 17.1111 35.6154 19.9114 35.6154 23.4444C35.6154 26.9775 32.6521 29.7778 29.0769 29.7778H24.3846V17.1111ZM26.3846 19.1111V27.7778H29.0769C31.6194 27.7778 33.6154 25.8024 33.6154 23.4444C33.6154 21.0864 31.6194 19.1111 29.0769 19.1111H26.3846Z"
//         fill="#24292E"
//       ></path>
//     </svg>
//   );
// };

// // MacbookScroll demo
// const MacbookScrollDemo = () => {
//   return (
//     <div className="overflow-hidden dark:bg-[#0B0B0F] bg-white w-full">
//       <MacbookScroll
//         title={
//           <span>
//             This Macbook is built with Tailwindcss. <br /> No kidding.
//           </span>
//         }
//         badge={
//           <a href="https://peerlist.io/manuarora">
//             <Badge className="h-10 w-10 transform -rotate-12" />
//           </a>
//         }
//         src={`/linear.webp`}
//         showGradient={false}
//       />
//     </div>
//   );
// };

// export default function Hero() {
//   return (
//     <div className="relative my-10 flex w-full flex-col items-center justify-center">
//       {/* Full-screen Edge Borders */}
//       <div className="pointer-events-none fixed inset-0 z-0">
//         <div className="absolute top-0 left-0 w-full h-px bg-neutral-200 dark:bg-neutral-800">
//           <div className="mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
//         </div>
//         <div className="absolute bottom-0 left-0 w-full h-px bg-neutral-200 dark:bg-neutral-800">
//           <div className="mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
//         </div>
//         <div className="absolute top-0 left-0 h-full w-px bg-neutral-200 dark:bg-neutral-800">
//           <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
//         </div>
//         <div className="absolute top-0 right-0 h-full w-px bg-neutral-200 dark:bg-neutral-800">
//           <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
//         </div>
//       </div>

//       {/* Hero Content */}
//       <div className="z-10 px-4 py-10 md:py-20 text-center space-y-6">
//         <h1 className="mx-auto max-w-3xl text-3xl font-bold text-slate-900 dark:text-slate-300 md:text-5xl lg:text-6xl">
//           {"Smarter Money Moves Powered by AI".split(" ").map((word, index) => (
//             <motion.span
//               key={index}
//               initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
//               animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
//               transition={{
//                 duration: 0.5,
//                 delay: index * 0.1,
//                 ease: "easeInOut",
//               }}
//               className="mr-2 inline-block"
//             >
//               {word}
//             </motion.span>
//           ))}
//         </h1>

//         <motion.p
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.7 }}
//           className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-400"
//         >
//           Unlock the full potential of your finances with intelligent insights,
//           real-time tracking, and automated budgeting — all in one powerful
//           platform.
//         </motion.p>

//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 1 }}
//           className="mt-8 flex flex-wrap items-center justify-center gap-4"
//         >
//           <Button size="lg">Get Started</Button>
//           <Button variant="outline" size="lg">
//             Watch Demo
//           </Button>
//         </motion.div>
//       </div>

//       {/* Macbook Scroll Section */}
//       <div className="w-full mt-10">
//         <MacbookScrollDemo />
//       </div>

//       {/* Hero Image */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, delay: 1.3 }}
//         className="relative w-[90vw] min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[720px] overflow-hidden rounded-xl border-y border-neutral-300 dark:border-neutral-700 drop-shadow-xl mt-10"
//       >
//         <Image
//           src="/Images/hero.jpeg"
//           alt="Hero Image"
//           fill
//           className="object-cover"
//           priority
//         />
//       </motion.div>
//     </div>
//   );
// }
