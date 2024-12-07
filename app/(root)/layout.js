import Sidebar from "@/components/Sidebar";
import "@/app/globals.css";
import Header from "@/components/Header";
import { MyProvider } from "@/context/MyContext";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "OOH POINT",
  description: "OOH POINT Admin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="text-sm md:text-base">
        <MyProvider>
          <Toaster />
          {/* {children} */}
          <div className="flex justify-between items-center w-full h-screen bg-gradient-to-b from-white to-oohpoint-grey-200">
            <Sidebar />
            <div className="flex flex-col justify-start items-center md:w-[calc(100%-4rem)] w-full bg-oohpoint-grey-200 h-screen overflow-y-scroll">
              <Header />
              {children}
            </div>
          </div>
        </MyProvider>
      </body>
    </html>
  );
}
