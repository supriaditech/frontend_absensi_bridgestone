import Image from "next/image";
import React from "react";

function CardImage() {
  return (
    <div className="bg-white h-full rounded-lg flex flex-col md:justify-center items-center px-10 md:pt-16">
      <Image
        width={600}
        height={20}
        src={"/assets/login/loginImage.png"}
        alt="Iustrator Login"
      />
      <p className="font-bold text-lg">Sistem Informasi Karyawan</p>
    </div>
  );
}

export default CardImage;
