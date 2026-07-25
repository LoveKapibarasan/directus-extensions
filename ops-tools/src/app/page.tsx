import Link from 'next/link';

export default function Home() {
  return (
    <ul>
      <li>
        <Link href="/export-transactions">Export Transactions (XLSX)</Link>
      </li>
      <li>
        <Link href="/payments">Payments DB viewer</Link>
      </li>
    </ul>
  );
}
