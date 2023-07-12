"use client";

import { Providers } from "@src/app/provider";
import { api } from "@src/utils/api";
import { Navbar } from "@components/layout/Navbar";
import { Footer } from "@components/layout/Footer";
import Head from "next/head";
import React from "react";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// export const metadata = {
//   title: "Next.js",
//   description: "Generated by Next.js",
// };

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <html lang="en">
        <body
          className={
            "min-w-screen relative flex min-h-screen flex-col bg-[#001C30]"
          }
        >
          <Navbar className={"sticky left-0 right-0 top-0 z-10"} />
          <main className={"relative mx-8 my-4 flex flex-1 flex-col"}>
            {children}
          </main>
          <Footer />
          <ToastContainer />
        </body>
      </html>
    </Providers>
  );
}

export default api.withTRPC(RootLayout);

/*
"use client";

import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "@src/utils/api";
import "@src/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

* */
