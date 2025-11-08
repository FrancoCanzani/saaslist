import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-dashed dark:border-gray-800 border-gray-100  mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <h3 className="font-mono font-medium text-xl">SaasList</h3>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Browse
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  href="/products/new"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Submit Product
                </Link>
              </li>
              <li>
                <Link
                  href="/newsletter"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Makers
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Advertise
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
