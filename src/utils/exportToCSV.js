export const exportToCSV = (transactions, month, year) => {
  if (!transactions.length) return;

  const headers = [
    "Date",
    "Time",
    "Type",
    "Category",
    "Note",
    "Amount",
  ];

  const rows = transactions.map((txn) => {
    const d = new Date(txn.createdAt);

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
      txn.type,
      txn.category,
      txn.note || "",
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
  a.download = `expenses_${month}_${year}.csv`;
  a.click();

  URL.revokeObjectURL(url);
};
