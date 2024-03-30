"use client";
import { SiWebmoney } from "react-icons/si";
import { Aptos, Network, AptosConfig } from '@aptos-labs/ts-sdk';
import { useEffect } from "react";
import { useKeylessAccounts } from "../core/useKeylessAccounts";
import GoogleLogo from "../components/GoogleLogo";
import { collapseAddress } from "../core/utils";

// pages/my-page.jsx
import dynamic from 'next/dynamic';

// 使用动态导入并禁用SSR
const NoSSRComponent = dynamic(() => import('@/components/Redirect'), {
  ssr: false,
});
export default function Home() {
  const aptosConfig = new AptosConfig({ network: Network.DEVNET });
  const aptos = new Aptos(aptosConfig);  // Only devnet supported as of now.
  const { activeAccount, disconnectKeylessAccount } = useKeylessAccounts();

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
        <div>
          <NoSSRComponent />
          <div className="grid gap-2">
            {activeAccount ? (
              <div className="flex justify-center items-center border rounded-lg px-8 py-2 shadow-sm cursor-not-allowed">
                <GoogleLogo />
                {collapseAddress(activeAccount?.accountAddress.toString())}
              </div>
            ) : (
              <p>Not logged in</p>
            )}
            <button
              className="flex justify-center bg-red-50 items-center border border-red-200 rounded-lg px-8 py-2 shadow-sm shadow-red-300 hover:bg-red-100 active:scale-95 transition-all"
              onClick={disconnectKeylessAccount}
            >
              Logout
            </button>
          </div>
        </div>
      </main>

    </>
  );
}
