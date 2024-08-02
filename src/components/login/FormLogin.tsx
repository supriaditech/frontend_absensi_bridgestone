import { Button, Input } from "@material-tailwind/react";
import React from "react";

function FormLogin() {
  return (
    <div className="flex flex-col justify-center items-center px-40 gap-4">
      <p className="text-4xl font-bold">Login</p>
      <Input crossOrigin={""} label="Masukan Id Karyawan" />
      <Input crossOrigin={""} label="Password" />
      <Button className="px-20">Login</Button>
    </div>
  );
}

export default FormLogin;
