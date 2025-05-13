import styles from "./RecentTransactions.module.css";
import { useState, useContext, useEffect } from "react";
import { Transactions } from "../Context";
import { RxCrossCircled } from "react-icons/rx";
import { MdOutlineEdit } from "react-icons/md";
import { PiPizzaLight } from "react-icons/pi";
import EntertainmentIcon from "../../assets/entertainment.svg";
import FoodIcon from "../../assets/food.svg";
import TravelIcon from "../../assets/travel.svg";
import { useSnackbar } from "notistack";
import Modal from "../ReactModal/ReactModal";

export default function RecentTransaction() {
  const { transactions, setTransactions } = useContext(Transactions);
  const [isOpen, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { walletBalance, expenses } = useContext(Transactions);

  //   useEffect(() => {
  //     console.log(transactions);
  //     console.log(walletBalance, expenses);
  //   }, [transactions, walletBalance, expenses]);

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
                  <img src={FoodIcon} />
                  <div>
                    <p style={{ margin: "0" }}>{transaction.title}</p>
                    <p style={{ margin: "0", color: "gray" }}>{transaction.date}</p>
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
                    onClick={() => setOpen(!isOpen)}
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
    </div>
  );
}
