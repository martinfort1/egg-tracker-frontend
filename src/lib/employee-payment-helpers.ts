export const getEmployeePaymentStatus = (employee: any) => {
  const now = new Date();

  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const paymentsThisMonth = employee.payments?.filter((p: any) => {
    const d = new Date(p.date);
    return d >= start && d < end;
  }) || [];

  const paid = paymentsThisMonth.reduce(
    (sum: number, p: any) => sum + p.amount,
    0
  );

  const owed = employee.salary - paid;

  if (paid === 0) {
    return {
      status: "Payment Due",
      color: "text-red-400",
      text: `Owes $${new Intl.NumberFormat("es-AR").format(owed)}`,
      paid,
      owed,
    };
  }

  if (owed > 0) {
    return {
      status: "Partially Paid",
      color: "text-yellow-400",
      text: `Remaining $${new Intl.NumberFormat("es-AR").format(owed)}`,
      paid,
      owed,
    };
  }

  if (owed === 0) {
    return {
      status: "Paid",
      color: "text-green-400",
      text: "Salary completed",
      paid,
      owed: 0,
    };
  }

  return {
    status: "Advanced",
    color: "text-cyan-400",
    text: `Advance $${new Intl.NumberFormat("es-AR").format(Math.abs(owed))}`,
    paid,
    owed,
  };
};