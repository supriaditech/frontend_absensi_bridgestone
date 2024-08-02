import Image from "next/image";
import React from "react";

function CardImage() {
  return (
    <div className="bg-secondary h-full rounded-lg flex justify-center items-center">
      <Image
        width={600}
        height={20}
        src={"/assets/login/loginImage.png"}
        alt="Iustrator Login"
      />
    </div>
  );
}

export default CardImage;
