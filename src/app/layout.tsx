import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minecraft Video Generator",
  description: "Generate cinematic Minecraft-style videos from text prompts using AI",
  keywords: ["minecraft", "video", "generation", "AI", "text-to-video"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 font-sans">
        <div className="min-h-screen">
          <header className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-6">
              <h1 className="text-3xl font-bold tracking-tight">
                🎮 Minecraft Video Generator
              </h1>
              <p className="text-green-100 mt-2">
                Transform your ideas into cinematic Minecraft adventures
              </p>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-slate-800 text-slate-300 py-6 mt-16">
            <div className="container mx-auto px-4 text-center">
              <p>&copy; 2024 Minecraft Video Generator. Powered by AI.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}