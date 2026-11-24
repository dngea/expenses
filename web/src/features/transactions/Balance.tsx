import { Wallet } from "lucide-react";
import type { DecimalString } from "../../shared/api/types";
import { formatEur } from "../../shared/lib/format";

interface BalanceProps {
  /** undefined while loading or if the request failed. */
  balance: DecimalString | undefined;
}

/** All-time balance (incomes − expenses), shown above the Expenses | Income switch. */
export function Balance({ balance }: BalanceProps) {
  const negative = balance?.startsWith("-") ?? false;
  return (
    <div
      className="flex items-center justify-center gap-2"
      aria-label="Balance"
      title="Balance"
    >
      <Wallet size={20} className="text-ink-muted" aria-hidden="true" />
      <span
        className={`text-lg font-semibold tabular-nums ${negative ? "text-red-400" : "text-ink"}`}
      >
        {balance === undefined ? "—" : formatEur(balance)}
      </span>
    </div>
  );
}
