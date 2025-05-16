import styles from "./HomePage.module.css";
import SectionExpenseTracker from "../components/TrackerSection/TrackerSection";
import { SnackbarProvider } from "notistack";
import { Transactions } from "../components/Context";
import { useState, useEffect } from "react";
import RecentTransaction from "../components/RecentTransactions/RecentTransactions";
import BarChartSection from "../components/BarChartSection/BarChartSection";

export default function HomePage() {
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [expenses, setExpenses] = useState([]);

  //For walletbalance and totalExpenses
  useEffect(() => {
    const walletBalance = localStorage.getItem("walletBalance");
    const totalExpenses = localStorage.getItem("totalExpenses");
    if (!walletBalance) {
      localStorage.setItem("walletBalance", 5000);
      setWalletBalance(5000);
    } else {
      setWalletBalance(Number(walletBalance));
    }

    if (!totalExpenses) {
      localStorage.setItem("totalExpenses", 0);
      setTotalExpenses(0);
    } else {
      setTotalExpenses(Number(totalExpenses));
    }
  }, []);

  //For transactions
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("expenses"));
      if (Array.isArray(stored)) {
        setExpenses(stored);
      } else {
        localStorage.setItem("expenses", JSON.stringify([]));
        setExpenses([]);
      }
    } catch (err) {
      console.error("Error parsing transactions from localStorage:", err);
      localStorage.setItem("expenses", JSON.stringify([]));
      setExpenses([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  //For updating the total totalExpenses price according to the transaction list change
  useEffect(() => {
    if (expenses.length) {
      let expenseAmount = expenses.reduce((acc, curr) => {
        let amount = parseInt(curr.price);
        return acc + amount;
      }, 0);
      // console.log(expenseAmount);
      localStorage.setItem("totalExpenses", expenseAmount);
      setTotalExpenses(expenseAmount);
    }
  }, [expenses]);

  return (
    <Transactions.Provider
      value={{
        expenses,
        setExpenses,
        walletBalance,
        setWalletBalance,
        totalExpenses,
        setTotalExpenses,
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
