import { Separator } from "@/components/ui/separator";
import {
  Signature as DribbbleIcon,
  Signature as GithubIcon,
  Signature as TwitchIcon,
  Signature as TwitterIcon,
} from "lucide-react";

const footerSections = [
  {
    title: "COMPANY",
    links: [
      {
        title: "About us",
        href: "#",
      },
      {
        title: "Home",
        href: "#",
      },
      {
        title: "Delivery",
        href: "#",
      },
      {
        title: "Privacy policy",
        href: "#",
      },
    ],
  },
  {
    title: "GET IN TOUCH",
    links: [
      {
        title: "+1-000-000-0000",
        href: "#",
      },
      {
        title: "https://github.com/amineelamrani",
        href: "https://github.com/amineelamrani",
      },
    ],
  },
];

const Footer01Page = () => {
  return (
    <div className="flex flex-col pt-10 w-full">
      <footer>
        <div className="w-full">
          <div className="py-5 flex flex-col lg:flex-row items-start justify-between gap-5">
            <div className="w-full lg:w-1/2">
              {/* Logo */}
              <h1 className="text-3xl">FOREVER.</h1>

              <p className="mt-4 text-muted-foreground text-sm w-full max-w-full lg:max-w-96">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>
            </div>
            <div className="w-full lg:w-2/5 flex justify-start lg:justify-between gap-10 lg:gap-0">
              {footerSections.map(({ title, links }) => (
                <div key={title}>
                  <h6 className="font-semibold text-xl pb-5">{title}</h6>
                  <ul className="">
                    {links.map(({ title, href }) => (
                      <li key={title}>
                        <a
                          href={href}
                          className="text-muted-foreground hover:text-foreground text-sm"
                        >
                          {title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <Separator />
          <div className="py-3 flex flex-col-reverse items-center justify-center ">
            {/* Copyright */}
            <span className="text-muted-foreground">
              Copyright &copy; {new Date().getFullYear()}{" "}
              <a href="/" target="_blank">
                AminAmra
              </a>
              . All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer01Page;
