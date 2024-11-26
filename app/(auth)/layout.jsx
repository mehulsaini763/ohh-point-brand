import "@/app/globals.css";

export const metadata = {
  title: "OOH POINT",
  description: "OOH POINT Admin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="">
       {children}
      </body>
    </html>
  );
}
