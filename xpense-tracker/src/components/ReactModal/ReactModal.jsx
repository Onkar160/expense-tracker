import ReactModal from "react-modal";
import { useState, useContext } from "react";
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
    if (walletAmount >= 100000000) {
      enqueueSnackbar("Cannot add amount more than 100000000", {
        variant: "warning",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
      return;
    }
    if (walletAmount < expenses) {
      enqueueSnackbar(
        "The amount you are trying to add is lower than your expenses, please add more amount than expenses or lower your expenses",
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
    localStorage.setItem("walletBalance", walletAmount);
    setWalletBalance(walletAmount);
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
            />
            <button
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
              onClick={updateWalletBalance}
            >
              Add Balance
            </button>
            <button
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
    amount: "",
    category: "",
    date: "",
  });

  const editTransaction = (transactionID) => {
    const editedTransactions = transactions.map((transaction) => {
      if (transaction.id === transactionID) {
        if (
          !expenseData.title ||
          !expenseData.amount ||
          !expenseData.category ||
          !expenseData.date
        ) {
          enqueueSnackbar(
            "All fields are important, please fill them before adding",
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
        if (
          parseInt(expenseData.amount) > parseInt(walletBalance) ||
          parseInt(expenses) + parseInt(expenseData.amount) >
            parseInt(walletBalance)
        ) {
          enqueueSnackbar(
            "Your expense amount is more than wallet balance. Please lower the amount and try again",
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
        transaction.title = expenseData.title;
        transaction.amount = expenseData.amount;
        transaction.category = expenseData.category;
        transaction.date = expenseData.date;
      }
      console.log(editedTransactions);
    });
  };

  const { transactions, setTransactions } = useContext(Transactions);
  // console.log(transactions);

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
    if (
      !expenseData.title ||
      !expenseData.amount ||
      !expenseData.category ||
      !expenseData.date
    ) {
      enqueueSnackbar(
        "All fields are important, please fill them before adding",
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
    if (
      parseInt(expenseData.amount) > parseInt(walletBalance) ||
      parseInt(expenses) + parseInt(expenseData.amount) >
        parseInt(walletBalance)
    ) {
      enqueueSnackbar(
        "Your expense amount is more than wallet balance. Please lower the amount and try again",
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

    setWalletBalance((prevBalance) => {
      return prevBalance - Number(expenseData.amount);
    });

    setTransactions((prevData) => {
      return [...prevData, { id: uuidv4(), ...expenseData }];
    });
    setOpen(false);
    // console.log(transactions);
  };

  return (
    <div style={{ textAlign: "start", width: "100%" }}>
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
            onChange={handleChange}
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
            name="amount"
            onChange={handleChange}
          />
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <select
            name="category"
            defaultValue=""
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
          />
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <button
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
            onClick={() =>
              transactionID.length
                ? editTransaction(transactionID)
                : addExpense()
            }
          >
            Add Expense
          </button>
          <button
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
    </div>
  );
}
