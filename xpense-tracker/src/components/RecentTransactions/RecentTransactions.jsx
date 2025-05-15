import styles from "./RecentTransactions.module.css";
import { useState, useContext, useEffect } from "react";
import { Transactions } from "../Context";
import { RxCrossCircled } from "react-icons/rx";
import { MdOutlineEdit } from "react-icons/md";
import EntertainmentIcon from "../../assets/entertainment.svg";
import FoodIcon from "../../assets/food.svg";
import TravelIcon from "../../assets/travel.svg";
import { useSnackbar } from "notistack";
import Modal from "../ReactModal/ReactModal";

export default function RecentTransaction() {
  const {
    transactions,
    setTransactions,
    walletBalance,
    expenses,
    setWalletBalance,
    setExpenses,
  } = useContext(Transactions);
  const [isOpen, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [selectedTransactionID, setSelectedTransactionID] = useState(null);

  //   useEffect(() => {
  //     console.log(transactions);
  //     console.log(walletBalance, expenses);
  //   }, [transactions, walletBalance, expenses]);

  const deleteTransaction = (id) => {
    let transactionAmount = 0;
    const newTransactions = transactions.filter((item) => {
      if (id !== item.id) {
        return item;
      } else {
        transactionAmount += Number(item.amount);
      }
    });
    let currentBalance = Number(localStorage.getItem("walletBalance"));
    let currentExpense = Number(localStorage.getItem("expenses"));

    // console.log(currentBalance);
    currentExpense -= transactionAmount;
    currentBalance += transactionAmount;
    localStorage.setItem("walletBalance", currentBalance);
    localStorage.setItem("expenses", currentExpense);

    setExpenses(currentExpense);
    setWalletBalance(currentBalance);
    setTransactions(newTransactions);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className={styles.wrapper}>
      <h1
        style={{ fontStyle: "italic", color: "white", marginBottom: "10px" }}
        className={styles.heading}
      >
        Recent Transactions
      </h1>
      <div className={styles.transactions_box}>
        {transactions.length ? (
          transactions.map((transaction) => {
            return (
              <div className={styles.transaction} key={transaction.id}>
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginTop: "15px",
                    width: "200px",
                    alignItems: "center",
                  }}
                >
                  {transaction.category === "food" && <img src={FoodIcon} />}
                  {transaction.category === "entertainment" && (
                    <img src={EntertainmentIcon} />
                  )}
                  {transaction.category === "travel" && (
                    <img src={TravelIcon} />
                  )}

                  <div>
                    <p style={{ margin: "0" }}>{transaction.title}</p>
                    <p style={{ margin: "0", color: "gray" }}>
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "15px",
                    alignItems: "center",
                  }}
                >
                  <h3 style={{ color: "#F4BB4A", marginRight: "20px" }}>
                    ₹{transaction.amount}
                  </h3>
                  <button
                    style={{
                      backgroundColor: "#FF3E3E",
                      border: "none",
                      paddingTop: "4px",
                      borderRadius: "15px",
                      boxShadow: "0 4px 4px rgba(0, 0, 0, 0.2)",
                      height: "min-content",
                      cursor: "pointer",
                    }}
                    onClick={() => deleteTransaction(transaction.id)}
                  >
                    <RxCrossCircled size={30} color="white" />
                  </button>
                  <button
                    style={{
                      backgroundColor: "#F4BB4A",
                      border: "none",
                      paddingTop: "4px",
                      borderRadius: "15px",
                      boxShadow: "0 4px 4px rgba(0, 0, 0, 0.2)",
                      height: "min-content",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setOpen(!isOpen);
                      setSelectedTransactionID(transaction.id);
                    }}
                  >
                    <MdOutlineEdit size={30} color="white" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.transaction}>
            <p>No Transactions</p>
          </div>
        )}
      </div>
      {selectedTransactionID && (
        <Modal
          open={isOpen}
          type={"Expenses"}
          setOpen={setOpen}
          transactionID={selectedTransactionID}
        />
      )}
    </div>
  );
}
