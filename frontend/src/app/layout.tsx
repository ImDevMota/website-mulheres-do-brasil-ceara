// src/app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Rodas de Conversa - Ceará",
  description: "Mapa de rodas de conversa no Ceará",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
