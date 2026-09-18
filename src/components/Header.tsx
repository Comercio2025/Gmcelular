import { useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { Menu, X } from "lucide-react";

export const Header = () => {
  const { config, pages } = useData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          {config.logoUrl ? (
            <div className="w-16 h-16 bg-surface rounded-xl p-1 shadow-lg shadow-primary/10 transition-transform hover:scale-105">
              <img
                src={config.logoUrl}
                alt={config.storeName}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center font-bold text-xl text-white">
              {(config?.storeName || "GM").substring(0, 2).toUpperCase()}
            </div>
          )}
          <span className="text-2xl font-display font-bold text-white hidden sm:block">
            {config.storeName}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="transition-colors font-medium hover:text-white"
            style={{
              fontSize: config.menuFontSize || "16px",
              color: config.menuTextColor || "#d1d5db",
            }}
          >
            Início
          </Link>

          <Link
            to="/promocoes"
            className="transition-colors font-medium hover:text-white"
            style={{
              fontSize: config.menuFontSize || "16px",
              color: config.menuTextColor || "#d1d5db",
            }}
          >
            Promoções
          </Link>

          <Link
            to="/artigos"
            className="transition-colors font-medium hover:text-white"
            style={{
              fontSize: config.menuFontSize || "16px",
              color: config.menuTextColor || "#d1d5db",
            }}
          >
            Artigos
          </Link>

          <Link
            to="/melhor-celular"
            className="transition-all font-semibold hover:scale-105"
            style={{
              fontSize: config.menuFontSize || "15px",
              background: "linear-gradient(135deg, #f97316, #fb923c)",
              color: "#fff",
              padding: "6px 16px",
              borderRadius: "999px",
              boxShadow: "0 4px 14px rgba(249,115,22,0.35)",
              whiteSpace: "nowrap",
            }}
          >
            Melhor Celular
          </Link>

          <a
            href="https://administrativo.gmcelular.com.br/trabalhe-conosco"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all font-semibold hover:scale-105"
            style={{
              fontSize: config.menuFontSize || "15px",
              background: "linear-gradient(135deg, #1565d8, #2176ff)",
              color: "#fff",
              padding: "6px 16px",
              borderRadius: "999px",
              boxShadow: "0 4px 14px rgba(33,118,255,0.35)",
              whiteSpace: "nowrap",
            }}
          >
            💼 Trabalhe Conosco
          </a>

          {pages
            .filter((p) => p.active)
            .map((page) =>
              page.externalLink ? (
                <a
                  key={page.id}
                  href={page.externalLink}
                  target={
                    page.externalLink.startsWith("http") ? "_blank" : "_self"
                  }
                  rel={
                    page.externalLink.startsWith("http")
                      ? "noopener noreferrer"
                      : ""
                  }
                  className="transition-colors font-medium hover:text-white"
                  style={{
                    fontSize: config.menuFontSize || "16px",
                    color: config.menuTextColor || "#d1d5db",
                  }}
                >
                  {page.title}
                </a>
              ) : (
                <Link
                  key={page.id}
                  to={`/pages/${page.slug}`}
                  className="transition-colors font-medium hover:text-white"
                  style={{
                    fontSize: config.menuFontSize || "16px",
                    color: config.menuTextColor || "#d1d5db",
                  }}
                >
                  {page.title}
                </Link>
              ),
            )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-white/80 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Abrir menu de navegação"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-24 left-0 w-full bg-background border-b border-white/5 shadow-2xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col p-4 gap-4">
            <Link
              to="/"
              className="transition-colors font-medium hover:text-white p-2"
              style={{
                fontSize: config.menuFontSize || "16px",
                color: config.menuTextColor || "#d1d5db",
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Início
            </Link>

            <Link
              to="/promocoes"
              className="transition-colors font-medium hover:text-white p-2"
              style={{
                fontSize: config.menuFontSize || "16px",
                color: config.menuTextColor || "#d1d5db",
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Promoções
            </Link>

            <Link
              to="/artigos"
              className="transition-colors font-medium hover:text-white p-2"
              style={{
                fontSize: config.menuFontSize || "16px",
                color: config.menuTextColor || "#d1d5db",
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Artigos
            </Link>

            <Link
              to="/melhor-celular"
              className="transition-all font-semibold text-center"
              style={{
                fontSize: config.menuFontSize || "15px",
                background: "linear-gradient(135deg, #f97316, #fb923c)",
                color: "#fff",
                padding: "10px 16px",
                borderRadius: "12px",
                boxShadow: "0 4px 14px rgba(249,115,22,0.35)",
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Melhor Celular
            </Link>

            <a
              href="https://administrativo.gmcelular.com.br/trabalhe-conosco"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all font-semibold text-center"
              style={{
                fontSize: config.menuFontSize || "15px",
                background: "linear-gradient(135deg, #1565d8, #2176ff)",
                color: "#fff",
                padding: "10px 16px",
                borderRadius: "12px",
                boxShadow: "0 4px 14px rgba(33,118,255,0.35)",
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              💼 Trabalhe Conosco
            </a>

            {pages
              .filter((p) => p.active)
              .map((page) =>
                page.externalLink ? (
                  <a
                    key={page.id}
                    href={page.externalLink}
                    target={
                      page.externalLink.startsWith("http") ? "_blank" : "_self"
                    }
                    rel={
                      page.externalLink.startsWith("http")
                        ? "noopener noreferrer"
                        : ""
                    }
                    className="transition-colors font-medium hover:text-white p-2"
                    style={{
                      fontSize: config.menuFontSize || "16px",
                      color: config.menuTextColor || "#d1d5db",
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {page.title}
                  </a>
                ) : (
                  <Link
                    key={page.id}
                    to={`/pages/${page.slug}`}
                    className="transition-colors font-medium hover:text-white p-2"
                    style={{
                      fontSize: config.menuFontSize || "16px",
                      color: config.menuTextColor || "#d1d5db",
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {page.title}
                  </Link>
                ),
              )}
          </nav>
        </div>
      )}
    </header>
  );
};
