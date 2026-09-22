import Link from "next/link";
export default function NotFound() {
  return (
    <main className="empty" style={{ paddingTop: 100 }}>
      <h1>A little off the beaten path.</h1>
      <p>Let’s get you back to what matters.</p>
      <Link className="button primary" href="/app/dashboard">
        Back to Miyo
      </Link>
    </main>
  );
}
