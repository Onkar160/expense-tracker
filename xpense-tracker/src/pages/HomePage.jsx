import styles from "./HomePage.module.css";
import SectionExpenseTracker from "../components/TrackerSection/TrackerSection";
import { SnackbarProvider } from "notistack";
import { Transactions } from "../components/Context";
import { useState, useEffect } from "react";
import RecentTransaction from "../components/RecentTransactions/RecentTransactions";
import BarChartSection from "../components/BarChartSection/BarChartSection";

export default function HomePage() {
  const [walletBalance, setWalletBalance] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [transactions, setTransactions] = useState([]);

  //For walletbalance and expenses
  useEffect(() => {
    const walletBalance = localStorage.getItem("walletBalance");
    const expenses = localStorage.getItem("expenses");
    if (!walletBalance) {
      localStorage.setItem("walletBalance", 5000);
      setWalletBalance(5000);
    } else {
      setWalletBalance(Number(walletBalance));
    }

    if (!expenses) {
      localStorage.setItem("expenses", 0);
      setExpenses(0);
    } else {
      setExpenses(Number(expenses));
    }
  }, []);

  //For transactions
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("transactions"));
      if (Array.isArray(stored)) {
        setTransactions(stored);
      } else {
        localStorage.setItem("transactions", JSON.stringify([]));
        setTransactions([]);
      }
    } catch (err) {
      console.error("Error parsing transactions from localStorage:", err);
      localStorage.setItem("transactions", JSON.stringify([]));
      setTransactions([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  //For updating the total expenses price according to the transaction list change
  useEffect(() => {
    if (transactions.length) {
      let expenseAmount = transactions.reduce((acc, curr) => {
        let amount = parseInt(curr.price);
        return acc + amount;
      }, 0);
      // console.log(expenseAmount);
      localStorage.setItem("expenses", expenseAmount);
      setExpenses(expenseAmount);
    }
  }, [transactions]);

  return (
    <Transactions.Provider
      value={{
        transactions,
        setTransactions,
        walletBalance,
        setWalletBalance,
        expenses,
        setExpenses,
      }}
    >
      <SnackbarProvider maxSnack={3}>
        <div className={styles.wrapper}>
          <SectionExpenseTracker />
          <div className={styles.box}>
            <RecentTransaction />
            <div className={styles.bar_chart}>
              <BarChartSection />
            </div>
          </div>
        </div>
      </SnackbarProvider>
    </Transactions.Provider>
  );
}
