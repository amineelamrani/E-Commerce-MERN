import { useEffect } from "react";
import contactUs from "../assets/contact_img-CyOum2vk.png";

export default function Contact() {
  useEffect(() => {
    document.title =
      "Contact US | FOREVER Store | The best store with the best quality price ration";
  }, []);

  return (
    <div className="py-15 flex flex-col gap-7">
      <h1 className="mb-4 text-center relative text-xl md:text-2xl font-bold after:content-[''] after:absolute after:top-1/2 after:w-8 md:after:w-14 after:h-[2px] after:bg-black">
        <span className="text-slate-500">CONTACT</span> US
      </h1>
      <div className="flex flex-col md:flex-row gap-8 justify-center">
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <img src={contactUs} alt="" className="w-2/3 " />
        </div>

        <div className="w-full md:w-1/2 flex gap-3 flex-col">
          <h1 className=" relative text-base md:text-xl font-bold after:content-[''] after:absolute after:top-1/2 after:w-8 md:after:w-14 after:h-[2px] after:bg-black">
            Our Store
          </h1>
          <p>Casablanca, Casablanca-Settat</p>
          <p>Morocco, 20000</p>
          <p>Tel : (+212) 666666666</p>
          <p>Email: admin@xxx.com</p>
        </div>
      </div>
    </div>
  );
}
