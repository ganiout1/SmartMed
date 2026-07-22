export default function CBTLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col font-sans">
      {children}
    </div>
  );
}
