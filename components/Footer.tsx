export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[#E8E7E3] bg-[#FAFAF8]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 sm:flex-row">
        <p className="text-xs text-[#9B9A95]">
          © {year}{" "}
          <a
            href="https://gafa.com.bo"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#6B6A65] transition-colors hover:text-[#3abeff]"
          >
            GAFA
          </a>
          {" "}· Todos los derechos reservados.
        </p>
        <p
          className="text-xs text-[#C8C7C2]"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Hecho en Bolivia 🇧🇴
        </p>
      </div>
    </footer>
  );
}
