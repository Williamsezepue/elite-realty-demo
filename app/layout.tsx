import '@/app/globals.css';
import { Metadata } from 'next';
import {  poppins } from '@/app/lib/fonts';
import ScrollToHash from '@/app/components/smooth';
import { Suspense } from 'react';
import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import { WebsiteProvider } from '@/app/components/provider';

export const metadata: Metadata = {
  title: 'Elite Realty — Real Estate Landing Page Demo',
  description: 'An elegant real estate landing page demo designed to showcase properties with modern layouts. Designed by Ezepue Williams',
};
 
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`flex flex-col`}>
      <body className={`${poppins.className} antialiased flex flex-1`}>
        <WebsiteProvider>
          <Suspense fallback={null}>
            <ScrollToHash />
          </Suspense>
          <div className='flex h-screen w-full flex-col overflow-hidden bg-gray-50'>
            <div id='scrollableParent' className='flex flex-col justify-between w-full relative overflow-x-hidden overflow-y-auto'>
              <Header />
                <div className='flex flex-1 flex-col min-h-max'>
                  <div className='flex min-h-screen justify-center'>
                    {children}
                  </div>
                </div>
              <Footer/>
            </div>
          </div>
        </WebsiteProvider>
      </body>
    </html>
  );
}