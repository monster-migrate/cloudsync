import { NextPage } from "next";
import Image from "next/image";

const NavComponent: NextPage = () => {
  return (
    <div className="w-full">
      <Image src="/logo.png" width={100} height={100} alt="brand" className="ml-5"/>
    </div>
  );
};

export default NavComponent;
