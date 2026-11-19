
import React, { useState, useEffect, useCallback } from "react";

function App() {
  const [currentInput, setCurrentInput] = useState("0");
  const [previousInput, setPreviousInput] = useState("");
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [shouldReset, setShouldReset] = useState(false);
  const [expression, setExpression] = useState("");

  // Calculate arithmetic operations
  const calculate = (first, second, op) => {
    switch (op) {
      case "+":
        return first + second;

      case "-":
        return first - second;

      case "*":
        return first * second;

      case "/":
        return second === 0 ? "Error" : first / second;

      default:
        return second;
    }
  };

  // Format result
  const formatResult = (number) => {
    if (!Number.isFinite(number)) return "Error";

    return String(
      parseFloat(number.toPrecision(12))
    );
  };

  // Clear calculator
  const clearCalculator = () => {
    setCurrentInput("0");
    setPreviousInput("");
    setFirstOperand(null);
    setOperator(null);
    setShouldReset(false);
    setExpression("");
  };

  // Delete last digit
  const deleteNumber = () => {
    if (currentInput === "Error") {
      clearCalculator();
      return;
    }

    if (shouldReset) return;

    setCurrentInput((prev) => {
      if (
        prev.length === 1 ||
        (prev.length === 2 && prev.startsWith("-"))
      ) {
        return "0";
      }

      return prev.slice(0, -1);
    });
  };

  // Enter numbers
  const appendNumber = (number) => {
    if (currentInput === "Error") {
      setCurrentInput(number === "." ? "0." : number);
      setShouldReset(false);
      setExpression("");
      return;
    }

    if (number === "." && !shouldReset && currentInput.includes(".")) {
      return;
    }

    if (shouldReset) {
      setCurrentInput(number === "." ? "0." : number);
      setShouldReset(false);
    } else {
      setCurrentInput((prev) => {
        if (prev === "0" && number !== ".") {
          return number;
        }

        return prev + number;
      });
    }
  };

  // Select arithmetic operator
  const chooseOperator = (selectedOperator) => {
    if (currentInput === "Error") return;

    const inputValue = parseFloat(currentInput);

    if (operator && !shouldReset) {
      const result = calculate(
        firstOperand,
        inputValue,
        operator
      );

      if (result === "Error") {
        setCurrentInput("Error");
        setPreviousInput("Cannot divide by zero");
        setFirstOperand(null);
        setOperator(null);
        setShouldReset(true);
        return;
      }

      const formatted = formatResult(result);

      setCurrentInput(formatted);
      setFirstOperand(result);
      setPreviousInput(`${formatted} ${selectedOperator}`);
    } else {
      setFirstOperand(inputValue);
      setPreviousInput(`${currentInput} ${selectedOperator}`);
    }

    setOperator(selectedOperator);
    setShouldReset(true);
    setExpression("");
  };

  // Calculate final result
  const showResult = () => {
    if (
      operator === null ||
      shouldReset ||
      currentInput === "Error"
    ) {
      return;
    }

    const secondOperand = parseFloat(currentInput);
    const first = firstOperand;
    const selectedOperator = operator;

    const result = calculate(
      first,
      secondOperand,
      selectedOperator
    );

    if (result === "Error") {
      setCurrentInput("Error");
      setPreviousInput("Cannot divide by zero");
      setExpression("");
    } else {
      setCurrentInput(formatResult(result));
      setPreviousInput(
        `${formatResult(first)} ${selectedOperator} ${currentInput} =`
      );
    }

    setFirstOperand(null);
    setOperator(null);
    setShouldReset(true);
  };

  // Handle keyboard input
  const handleKeyDown = useCallback((e) => {
    if (/^[0-9.]$/.test(e.key)) {
      appendNumber(e.key);
    } else if (["+", "-", "*", "/"].includes(e.key)) {
      chooseOperator(e.key);
    } else if (e.key === "Enter" || e.key === "=") {
      showResult();
    } else if (e.key === "Backspace") {
      deleteNumber();
    } else if (e.key === "Escape") {
      clearCalculator();
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Calculator buttons
  const buttons = [
    { label: "C", action: clearCalculator, type: "clear" },
    { label: "DEL", action: deleteNumber, type: "delete" },
    { label: "÷", action: () => chooseOperator("/"), type: "operator" },
    { label: "×", action: () => chooseOperator("*"), type: "operator" },

    { label: "7", action: () => appendNumber("7") },
    { label: "8", action: () => appendNumber("8") },
    { label: "9", action: () => appendNumber("9") },
    { label: "−", action: () => chooseOperator("-"), type: "operator" },

    { label: "4", action: () => appendNumber("4") },
    { label: "5", action: () => appendNumber("5") },
    { label: "6", action: () => appendNumber("6") },
    { label: "+", action: () => chooseOperator("+"), type: "operator" },

    { label: "1", action: () => appendNumber("1") },
    { label: "2", action: () => appendNumber("2") },
    { label: "3", action: () => appendNumber("3") },
    { label: "=", action: showResult, type: "equals" },

    { label: "0", action: () => appendNumber("0"), type: "zero" },
    { label: ".", action: () => appendNumber(".") },
  ];

  const getButtonStyle = (type) => {
    switch (type) {
      case "clear":
        return "bg-red-100 text-red-600 hover:bg-red-200";

      case "delete":
        return "bg-orange-100 text-orange-600 hover:bg-orange-200";

      case "operator":
        return "bg-indigo-100 text-indigo-700 hover:bg-indigo-200";

      case "equals":
        return "bg-violet-600 text-white hover:bg-violet-700 row-span-2";

      case "zero":
        return "col-span-2";

      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-200";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-5">

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-slate-800">
            Calculator
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            OIBSIP Internship - Task 1
          </p>
        </div>

        {/* Display */}
        <div className="bg-slate-900 rounded-2xl p-5 mb-5 min-h-32 flex flex-col justify-end items-end overflow-hidden">

          <p className="text-slate-400 text-sm min-h-6">
            {previousInput}
          </p>

          <h2 className="text-white text-4xl font-bold mt-2 max-w-full overflow-x-auto whitespace-nowrap">
            {currentInput}
          </h2>

        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-3">

          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={button.action}
              className={`
                h-16 rounded-xl text-xl font-bold
                transition-all duration-200
                active:scale-95
                shadow-sm
                ${getButtonStyle(button.type)}
              `}
            >
              {button.label}
            </button>
          ))}

        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">
            Built with React.js & Tailwind CSS
          </p>

          <p className="text-xs text-slate-300 mt-1">
            Oasis Infobyte Internship
          </p>
        </div>

      </div>
    </div>
  );
}

export default App;
