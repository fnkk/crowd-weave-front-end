import React, { FC, useState } from "react";
import { SiWebmoney } from "react-icons/si";
import Button from "@/components/common/Button";
import Link from "next/link";
import { ConnectWallet, lightTheme } from "@thirdweb-dev/react";

const Nav = ({}) => {
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
        <div className="text-xl font-semibold">TokenFest</div>
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
        <ConnectWallet
          theme={lightTheme({
            colors: { primaryButtonBg: "#3B82F6" },
          })}
          switchToActiveChain={true}
          modalSize={"wide"}
          welcomeScreen={{ title: "TokenFest" }}
        />
      </div>
    </div>
  );
};

export default Nav;
