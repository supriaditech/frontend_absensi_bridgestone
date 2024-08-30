import { ApiUrl } from "../config/config";

class Api {
  public url: string = "";
  public auth: boolean = false;
  public type: "form" | "json" | "multipart" = "json"; // Tambahkan tipe "multipart" untuk FormData
  public token: string = "";
  public header: any = {};
  public body: any = {};

  public call = async () => {
    const url = ApiUrl + this.url;
    const headers: any = {
      ...this.header,
    };

    // Hanya set Content-Type jika bukan multipart/form-data
    if (this.type === "json") {
      headers["Content-Type"] = "application/json";
    } else if (this.type === "form") {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
    }

    // Tambahkan Authorization jika dibutuhkan
    if (this.auth && this.token) {
      headers["Authorization"] = "Bearer " + this.token;
      headers["Accept"] = "application/json";
    }

    // Set body sesuai dengan tipe request
    let body: BodyInit;
    if (this.type === "json") {
      body = JSON.stringify(this.body);
    } else if (this.type === "form") {
      body = new URLSearchParams(this.body).toString();
    } else {
      body = this.body; // Jika tipe multipart, body sudah berbentuk FormData
    }

    const options: RequestInit = {
      method: "POST",
      headers: headers,
      body: body,
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("API call error:", error);
      return {
        meta: {
          code: 400,
          status: "Bad Request",
          message: "Bad Request",
        },
        data: error,
      };
    }
  };
}

export default Api;
