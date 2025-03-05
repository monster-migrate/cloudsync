import { NextPage } from "next";
import Image from "next/image";
import { Roboto_Condensed } from "next/font/google";
const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300"],
});
const NavComponent: NextPage = () => {
  return (
    <div className="w-full flex justify-start items-center text-white gap-4 text-4xl">
      <Image
        src="/logo.png"
        width={100}
        height={100}
        alt="brand"
        className="ml-5"
      />
      <p className={robotoCondensed.className}>cloudsync.</p>
    </div>
  );
};

export default NavComponent;
