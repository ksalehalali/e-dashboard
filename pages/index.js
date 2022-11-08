import { Button } from "antd";
import Head from "next/head";
import Image from "next/image";
import HomePage from "@/components/home/home";
// page content
import Main from "../components/layout/main";

// import sound from "assets/pristine-609.mp3";
export default function Home() {
    return (
        <div>
            <Head>
                <title>Dashboard</title>
                <meta name="description" content="Next.js Dashboard" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Main>
                <div>
                    <HomePage />
                </div>
            </Main>
        </div>
    );
}
