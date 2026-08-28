import Link from "next/link";

type SiteFooterProps = {
  showProductLinks?: boolean;
  className?: string;
};

export default function SiteFooter({
  showProductLinks = true,
  className = "",
}: SiteFooterProps) {
  return (
    <footer
      className={`relative border-t border-white/10 px-5 py-10 md:px-8 ${className}`}
    >
      <div className="mx-auto flex max-w-[1480px] flex-col gap-6 text-sm text-white/35 md:flex-row md:items-center md:justify-between">
        <div>
          <p>
            © 2025 Nestrova AI. All rights reserved.
          </p>

          <p className="mt-1">
            AI-powered intelligence for confident decisions.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-3">
          {showProductLinks ? (
            <>
              <Link
                href="/real-estate"
                className="transition hover:text-white"
              >
                Real Estate
              </Link>

              <Link
                href="/trading"
                className="transition hover:text-white"
              >
                Trading
              </Link>

              <Link
                href="/research"
                className="transition hover:text-white"
              >
                Research
              </Link>

              <Link
                href="/pricing"
                className="transition hover:text-white"
              >
                Pricing
              </Link>
            </>
          ) : null}

          <Link
            href="/terms"
            className="transition hover:text-white"
          >
            Terms
          </Link>

          <Link
            href="/privacy"
            className="transition hover:text-white"
          >
            Privacy
          </Link>

          <Link
            href="/refund"
            className="transition hover:text-white"
          >
            Refund
          </Link>

          <Link
            href="/contact"
            className="transition hover:text-white"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}   