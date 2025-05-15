import styles from "./TrackerSection.module.css";
import Modal from "../ReactModal/ReactModal";
import { useState, useContext } from "react";
import { Transactions } from "../Context";
// import { useSnackbar } from "notistack";
import CustomPieChart from "../PieChart/PieChart";

export default function SectionExpenseTracker() {
  // const {enqueueSnackbar} = useSnackbar();
  const { walletBalance, expenses } = useContext(Transactions);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.heading}>Expense Tracker</h1>
      <div className={styles.expense_wrapper}>
        <AmountSection type={"Wallet Balance"} amount={walletBalance} />
        <AmountSection type={"Expenses"} amount={expenses} />
        <CustomPieChart />
      </div>
    </div>
  );
}

function AmountSection({ type, amount }) {
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!isOpen);
  };

  return (
    <div className={styles.expense_box}>
      <p style={{ fontSize: "28px", color: "white", marginTop: "0" }}>
        {type}:{" "}
        <span
          style={{
            color: type === "Expenses" ? "#F4BB4A" : "#9DFF5B",
            fontWeight: "700",
          }}
        >
          ₹{amount}
        </span>
      </p>
      <button
        style={{
          padding: "10px 30px",
          borderRadius: "15px",
          color: "white",
          background:
            type === "Expenses"
              ? "linear-gradient(135deg, #FF9595, #FF3838)"
              : "linear-gradient(135deg, #B5DC52, #75CC3D)",
          border: "0px",
          fontSize: "20px",
          fontWeight: "700",
          cursor: "pointer",
        }}
        onClick={handleOpen}
      >
        + Add {type === "Wallet Balance" ? "Income" : "Expense"}
      </button>
      <Modal open={isOpen} type={type} setOpen={setOpen} />
    </div>
  );
}
