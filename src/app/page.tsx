"use client";
import { SiWebmoney } from "react-icons/si";

export default function Home() {
  return (
    <>
      <main className="flex justify-center items-center h-[100vh]">
        {/* <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"></div>  */}
        <div className="mt-[-180px]">
          <div className="text-center items-baseline justify-center flex font-medium text-8xl">
            T
            <span className="text-6xl">
              <SiWebmoney />
            </span>
            kenFest
          </div>
          <div className="text-center justify-center flex text-lg mt-2 mb-4">
            <h2>A Dao + NFT where people make thier dreams real</h2>
          </div>
          <div className="justify-center flex"></div>
        </div>
      </main>
    </>
  );
}
