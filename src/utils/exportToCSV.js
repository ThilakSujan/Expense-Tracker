export const exportToCSV = (transactions, month, year) => {
  if (!transactions || !transactions.length) return;

  const headers = [
    "Date",
    "Time",
    "Type",
    "Bank / Source",
    "Payment Mode",
    "Category",
    "Note",
    "Amount (INR)",
  ];

  const rows = transactions.map((txn) => {
    const d = new Date(txn.date || txn.createdAt);

    const date = d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const time = d.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return [
      date,
      time,
      txn.type.toUpperCase(),
      txn.bank || "Cash",
      txn.mode || "UPI",
      txn.category || "Others",
      (txn.note || "").replace(/"/g, '""'),
      txn.amount,
    ];
  });

  const csvContent =
    [headers, ...rows]
      .map((row) =>
        row.map((val) => `"${val}"`).join(",")
      )
      .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `expense_statement_${month}_${year}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
