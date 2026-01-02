import { ReactNode } from "react";
import Navigation from "./components/Navigation";
import Logo from "./components/Logo";

export const metadata = {
  title: "The Wild Oasis",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <header>
          <Logo />
          <Navigation />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
