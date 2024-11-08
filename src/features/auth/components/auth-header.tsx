// External Imports
import Image from "next/image";
import Link from "next/link";

// Local Imports

export const AuthHeader = () => {
  return (
    <header className="sticky top-0 z-50 py-6">
      <div className="flex justify-start">
        <Link href={"/"}>
          <div className="relative size-10">
            <Image
              src={"/images/logo.png"}
              alt="Logo"
              fill
              className="shadow-md"
            />
          </div>
        </Link>
      </div>
    </header>
  );
};
