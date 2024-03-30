import React, { FC, useState } from "react";
import { SiWebmoney } from "react-icons/si";
import Button from "@/components/common/Button";
import Link from "next/link";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { useEffect } from "react";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import GoogleLogo from "@/components/GoogleLogo";
import { collapseAddress } from "@/core/utils";

const Nav = ({}) => {
  const { activeAccount, disconnectKeylessAccount } = useKeylessAccounts();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navLinks = [
    {
      title: "Launch",
      subItems: [
        { title: "Create Proposal", path: "/launch/create-proposal" },
        { title: "Convert Proposal", path: "/launch/convert-proposal" },
      ],
    },
    {
      title: "Explore",
      subItems: [
        { title: "Ongoing Proposals", path: "/explore/ongoing-proposals" },
        {
          title: "Crowdfunding Events",
          path: "/explore/crowdfunding-events",
        },
      ],
    },
    {
      title: "Dashboard",
      subItems: [
        {
          title: "Crowdfunding Events",
          path: "/dashboard/crowdfunding-events",
        },
        { title: "Started Events", path: "/dashboard/started-events" },
      ],
    },
  ];

  return (
    <div className="px-6 py-4 shadow-sm flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <div className="text-2xl">
          <SiWebmoney />
        </div>
        <div className="text-xl font-semibold">CrowdWeave</div>
      </div>

      <div className="flex gap-4 items-center">
        {navLinks.map((navItem) => (
          <div
            key={navItem.title}
            className="relative  cursor-pointer"
            onMouseEnter={() => setActiveDropdown(navItem.title)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            {navItem.title}
            {navItem.subItems && (
              <div
                className={`absolute left-0 w-48 py-2 px-2 bg-white rounded-md shadow-xl  ${
                  activeDropdown === navItem.title ? "block" : "hidden"
                }`}
              >
                {navItem.subItems.map((subItem) => (
                  <Link
                    key={subItem.title}
                    href={subItem.path}
                    className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-500 rounded-md"
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <WalletSelector/>
        <div className="grid gap-2">
            {activeAccount ? (
              <div onClick={disconnectKeylessAccount} className="flex justify-center items-center border rounded-lg px-8 py-2 shadow-sm cursor-not-allowed">
                <GoogleLogo />
                {collapseAddress(activeAccount?.accountAddress.toString())}
              </div>
            ) : (
              <Link href={'/login'}>Login with google</Link >
            )}
          </div>
      </div>
    </div>
  );
};

export default Nav;
