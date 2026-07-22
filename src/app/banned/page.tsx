export default function BannedPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-surface p-4">
      <div className="max-w-md text-center space-y-6">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-error/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-error"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-text-primary">Akses Dilarang</h1>
        <p className="text-text-secondary text-lg">
          Akun Anda telah ditangguhkan sementara waktu atau diblokir oleh sistem karena melanggar kebijakan penggunaan.
        </p>
        <p className="text-text-tertiary text-sm">
          Jika Anda merasa ini adalah kesalahan, silakan hubungi Administrator SmartMed.
        </p>
      </div>
    </div>
  );
}
