import { formatCurrency } from "./utils";

export const getEmployeePaymentStatus = (employee: any) => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const currentPeriod = employee.salaryPeriods?.find(
    (payment: any) => payment.month === month && payment.year === year
    );

    // Get previous period's balance to use as carryover INTO this month
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevPeriod = employee.salaryPeriods?.find(
        (p: any) => p.month === prevMonth && p.year === prevYear
    );
    const carryoverBalance = prevPeriod?.balance ?? 0;

    const salary = currentPeriod?.salary ?? employee.salary;
  
    const paymentsThisMonth = employee.payments?.filter((p: any) => {
        const date = new Date(p.date);
        return date.getMonth() === month && date.getFullYear() === year;
    }) || [];

    const paid = paymentsThisMonth.reduce(
        (sum: number, payment: any) => sum + payment.amount,
        0
    );

  // Owed = (salary - carryover_balance) - paid_this_month
  // If carryover is positive (overpaid), it reduces what we owe
  const owed = (salary - carryoverBalance) - paid;

  if (paid === 0) {
    return {
      status: "Payment Due",
      color: "text-red-600",
      text: `Owed ${formatCurrency(owed)}`,
      paid,
      owed,
      salary,
      balance: carryoverBalance,
    };
  }

  if (owed > 0) {
    return {
      status: "Partially Paid",
      color: "text-yellow-400",
      text: `Remaining ${formatCurrency(owed)}`,
      paid,
      owed,
      salary,
      balance: carryoverBalance,
    };
  }

  if (owed === 0) {
    return {
      status: "Paid",
      color: "text-green-400",
      text: "Salary completed",
      paid,
      owed: 0,
      salary,
      balance: carryoverBalance,
    };
  }

  return {
    status: "Advanced",
    color: "text-cyan-400",
    text: `Advance ${formatCurrency(Math.abs(owed))}`,
    paid,
    owed,
    salary,
    balance: carryoverBalance,
  };
};