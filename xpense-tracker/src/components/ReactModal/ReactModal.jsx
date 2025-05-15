import ReactModal from "react-modal";
import { useState, useContext, useEffect } from "react";
import { Transactions } from "../Context";
import { useSnackbar } from "notistack";
import { v4 as uuidv4 } from "uuid";

ReactModal.setAppElement("#root");

export default function Modal({ open, type, setOpen, transactionID }) {
  const { enqueueSnackbar } = useSnackbar();
  const { walletBalance, setWalletBalance, expenses } =
    useContext(Transactions);
  const [walletAmount, setWalletAmount] = useState("");

  const updateAmount = (e) => {
    setWalletAmount(e.target.value);
    // console.log(e.target.value);
  };

  const updateWalletBalance = () => {
    const oldAmount = Number(localStorage.getItem("walletBalance"));
    // console.log(typeof oldAmount);
    // console.log(typeof walletAmount);
    if (oldAmount + Number(walletAmount) >= 100000000) {
      enqueueSnackbar("Cannot add amount more than 100000000", {
        variant: "warning",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
      return;
    }
    if (Number(walletAmount) < 0) {
      enqueueSnackbar(
        "Income should be greater than 0",
        {
          variant: "warning",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
        }
      );
      return;
    }
    localStorage.setItem("walletBalance", oldAmount + Number(walletAmount));
    setWalletBalance(oldAmount + Number(walletAmount));
    setWalletAmount("");
    setOpen(false);
  };

  return (
    <ReactModal
      isOpen={open}
      style={{
        overlay: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          display: "flex", // ← Crucial
          justifyContent: "center", // ← Crucial
          alignItems: "center",
        },
        content: {
          position: "relative",
          inset: "auto",
          width: "430px",
          maxWidth: "700px",
          height: "min-content",
          margin: "15px", // 🔥 this centers the modal box on screen
          border: "1px solid #ccc",
          background: "rgba(255, 255, 255, 0.75)",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: "15px",
          outline: "none",
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        },
      }}
    >
      {type === "Wallet Balance" ? (
        // Wallet modal
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateWalletBalance();
          }}
        >
          <div style={{ textAlign: "start", width: "100%" }}>
            <h1 style={{ marginTop: "0" }}>Add Balance</h1>
            <div style={{ display: "flex", gap: "15px" }}>
              <input
                type="number"
                placeholder="Income Amount"
                style={{
                  borderRadius: "15px",
                  border: "none",
                  padding: "10px",
                  boxShadow: "0 4px 4px rgba(0, 0, 0, 0.2)",
                }}
                onChange={updateAmount}
                value={walletAmount}
                required
              />
              <button
                type="submit"
                style={{
                  borderRadius: "15px",
                  border: "none",
                  padding: "15px",
                  background: "#F4BB4A",
                  cursor: "pointer",
                  color: "white",
                  boxShadow: "0 4px 4px rgba(0, 0, 0, 0.2)",
                  fontWeight: "600",
                }}
              >
                Add Balance
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  borderRadius: "15px",
                  border: "none",
                  padding: "10px",
                  cursor: "pointer",
                  boxShadow: "0 4px 4px rgba(0, 0, 0, 0.2)",
                  fontWeight: "500",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      ) : (
        <ExpenseModal
          setOpen={setOpen}
          enqueueSnackbar={enqueueSnackbar}
          walletBalance={walletBalance}
          expenses={expenses}
          transactionID={transactionID}
          setWalletBalance={setWalletBalance}
        />
      )}
    </ReactModal>
  );
}

//Expense modal

function ExpenseModal({
  setOpen,
  enqueueSnackbar,
  walletBalance,
  expenses,
  transactionID = "",
  setWalletBalance,
}) {
  const [expenseData, setExpenseData] = useState({
    title: "",
    price: "",
    category: "",
    date: "",
  });

  const { transactions, setTransactions } = useContext(Transactions);
  // console.log(transactions);

  useEffect(() => {
    if (transactionID.length) {
      const aTransaction = transactions.find((transaction) => {
        if (transaction.id === transactionID) {
          return transaction;
        }
      });
      // console.log(aTransaction);
      setExpenseData({
        title: aTransaction.title,
        price: aTransaction.price,
        category: aTransaction.category,
        date: aTransaction.date,
      });
    }
  }, []);

  const editTransaction = (transactionID) => {
    // console.log(transactionID);
    let oldTransaction = transactions.find((transaction) => {
      if (transaction.id === transactionID) {
        return transaction;
      }
    });
    let oldAmount = Number(oldTransaction.price);
    let newAmount = Number(expenseData.price);
    if (
      oldTransaction.price === expenseData.price &&
      oldTransaction.title === expenseData.title &&
      oldTransaction.date === expenseData.data &&
      oldTransaction.category === expenseData.category
    ) {
      setOpen(false);
      return;
    }
    // console.log(oldTransactionAmount);
    let updatedBalance =
      Number(localStorage.getItem("walletBalance")) + oldAmount;

    if (newAmount > updatedBalance) {
      enqueueSnackbar(
        "Your expenses amount is more than wallet balance. Please lower the amount and try again",
        {
          variant: "warning",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
        }
      );
      return;
    }
    const editedTransactions = transactions.map((transaction) => {
      if (transaction.id === transactionID) {
        transaction.title = expenseData.title;
        transaction.price = expenseData.price;
        transaction.category = expenseData.category;
        transaction.date = expenseData.date;
      }
      return transaction;
    });

    localStorage.setItem("walletBalance", updatedBalance);
    let currentBalance = Number(localStorage.getItem("walletBalance"));
    currentBalance -= Number(expenseData.price);
    localStorage.setItem("walletBalance", currentBalance);
    setWalletBalance(currentBalance);
    setTransactions(editedTransactions);
    setOpen(false);
    // console.log(editedTransactions);
  };

  const handleChange = (e) => {
    // console.log(e.target.value);

    setExpenseData((prevVal) => {
      return {
        ...prevVal,
        [e.target.name]: e.target.value,
      };
    });
    // console.log(expenseData);
  };

  const addExpense = () => {
    if (parseInt(expenseData.price) > parseInt(walletBalance)) {
      enqueueSnackbar(
        "Your expenses amount is more than wallet balance. Please lower the amount and try again",
        {
          variant: "warning",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
        }
      );
      return;
    }

    let currentBalance = Number(localStorage.getItem("walletBalance"));
    currentBalance -= Number(expenseData.price);
    localStorage.setItem("walletBalance", currentBalance);

    setWalletBalance((prevBalance) => {
      return prevBalance - Number(expenseData.price);
    });

    setTransactions((prevData) => {
      return [...prevData, { id: uuidv4(), ...expenseData }];
    });
    setOpen(false);
    // console.log(transactions);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        transactionID.length ? editTransaction(transactionID) : addExpense();
      }}
      style={{ textAlign: "start", width: "100%" }}
    >
      <h1 style={{ marginTop: "0" }}>
        {transactionID.length ? "Edit Expenses" : "Add Expenses"}
      </h1>
      <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: "15px" }}>
          <input
            type="text"
            placeholder="Title"
            style={{
              borderRadius: "15px",
              border: "none",
              padding: "15px",
              boxShadow: "0 4px 4px rgba(0, 0, 0, 0.2)",
              width: "50%",
            }}
            name="title"
            value={expenseData.title}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            placeholder="Price"
            style={{
              borderRadius: "15px",
              border: "none",
              padding: "15px",
              boxShadow: "0 4px 4px rgba(0, 0, 0, 0.2)",
              width: "50%",
            }}
            name="price"
            onChange={handleChange}
            value={expenseData.price}
            required
          />
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <select
            name="category"
            value={expenseData.category}
            style={{
              WebkitAppearance: "none",
              MozAppearance: "none",
              appearance: "none",
              borderRadius: "15px",
              border: "none",
              padding: "15px",
              boxShadow: "0 4px 4px rgba(0, 0, 0, 0.2)",
              width: "50%",
              color: "gray",
            }}
            required
            onChange={handleChange}
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="food">Food</option>
            <option value="entertainment">Entertainment</option>
            <option value="travel">Travel</option>
          </select>
          <input
            type="date"
            style={{
              borderRadius: "15px",
              border: "none",
              padding: "15px",
              boxShadow: "0 4px 4px rgba(0, 0, 0, 0.2)",
              width: "50%",
              color: "gray",
            }}
            name="date"
            onChange={handleChange}
            value={expenseData.date}
            required
          />
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <button
            type="submit"
            style={{
              borderRadius: "15px",
              border: "none",
              padding: "15px 0px",
              background: "#F4BB4A",
              cursor: "pointer",
              color: "white",
              boxShadow: "0 4px 4px rgba(0, 0, 0, 0.2)",
              fontWeight: "600",
              width: "50%",
            }}
          >
            Add Expense
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{
              borderRadius: "15px",
              border: "none",
              padding: "10px 30px",
              marginRight: "85px",
              cursor: "pointer",
              boxShadow: "0 4px 4px rgba(0, 0, 0, 0.2)",
              fontWeight: "500",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
