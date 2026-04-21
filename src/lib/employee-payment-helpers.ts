import { formatCurrency } from "./utils";

export const getEmployeePaymentStatus = (employee: any) => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const currentPeriod = employee.salaryPeriods?.find(
    (payment: any) => payment.month === month && payment.year === year
    );

    const salary = currentPeriod?.salary ?? employee.salary;
  
    const paymentsThisMonth = employee.payments?.filter((p: any) => {
        const date = new Date(p.date);
        return date.getMonth() === month && date.getFullYear() === year;
    }) || [];

    const paid = paymentsThisMonth.reduce(
        (sum: number, payment: any) => sum + payment.amount,
        0
    );

  const owed = salary - paid;

  if (paid === 0) {
    return {
      status: "Payment Due",
      color: "text-red-600",
      text: `Owed ${formatCurrency(owed)}`,
      paid,
      owed,
    };
  }

  if (owed > 0) {
    return {
      status: "Partially Paid",
      color: "text-yellow-400",
      text: `Remaining ${formatCurrency(owed)}`,
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
    text: `Advance ${formatCurrency(Math.abs(owed))}`,
    paid,
    owed,
  };
};