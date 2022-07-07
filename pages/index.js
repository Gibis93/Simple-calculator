import Head from "next/head";
import styles from "../styles/Home.module.scss";
import React, { useEffect, useState } from "react";
import { math } from "./utils/math.js";

const BASE_URL = "http://localhost:3000/api/resolve";
const calcButtons = [
  ["7", "8", "9", "+"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "x"],
  [".", "0", "C", "÷"],
  ["%", "+/-", "=", "his"],
];

export default function Home() {
  const [calc, setCalc] = useState({
    sign: "+",
    num: 0,
    res: 0,
  });
  const [message, setMessage] = useState("");

  const [history, setHistory] = useState([])

  const handleClick = (e) => {
    setMessage("");
    const btn = e.target.value;
    switch (btn) {
      case "+":
      case "-":
      case "x":
      case "÷":
        signClick(btn);
        break;
      case "CE":
        backspaceClick(btn);
        break;
      case "C":
        resetClick();
        break;
      case ".":
        commaClick(btn);
        break;
      case "=":
        resultClick();
        break;
      case "%":
        percentageClick();
        break;
      case "+/-":
        invertsignClick();
        break;
      case "his":
        getHistoryData();
        break;
      default:
        numClick(btn);
    }
  };

  const signClick = (btn) => {
    setCalc({
      ...calc,
      sign: btn,
      res: !calc.num
        ? calc.res
        : !calc.res
          ? calc.num
          : toLocaleString(math(Number(calc.res), Number(calc.num), calc.sign)),
      num: 0,
    });
  };
  const backspaceClick = (btn) => {
    console.log("backspace click", btn);
  };

  const resetClick = () => {
    setCalc({
      ...calc,
      sign: "",
      num: 0,
      res: 0,
    });
  };
  const commaClick = (btn) => {
    setCalc({
      ...calc,
      num: !calc.num.toString().includes(".") ? calc.num + btn : calc.num,
    });
  };

  const resultClick = () => {
    if (calc.sign && calc.num) {
      fetch(`${BASE_URL}`, {
        method: "POST",
        body: JSON.stringify(calc),
      }).then(async (response) => {
        if (!response.ok) {
          setMessage("Can't divide by 0");
        }
        const data = await response.json();
        return setCalc({ num: 0, res: data.response, sign: 0 });
      });
    }
  };

  const percentageClick = () => {
    let num = calc.num ? parseFloat(calc.num) : 0;
    let res = calc.res ? parseFloat(calc.res) : 0;
    setCalc({
      ...calc,
      num: (num /= Math.pow(100, 1)),
      res: (res /= Math.pow(100, 1)),
      sign: "",
    });
  };

  const invertsignClick = () => {
    setCalc({
      ...calc,
      num: calc.num ? (calc.num) * -1 : 0,
      res: calc.res ? (calc.res) * -1 : 0,
      sign: "",
    });
  };

  const numClick = (btn) => {
    setCalc({
      ...calc,
      num:
        calc.num === 0
          ? btn
          : calc.num != 0
            ? calc.num + btn
            : calc.num + "." + btn,
    });
  };

  const getHistoryData = async () => {
    const res = await fetch(`${BASE_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (res.status >= 200 && res.status <= 299) {
      return await res.json();
    }
  }

  return (
    <>
      <Head>
        <title>Calculator</title>
        <meta name='description' content='Generated by create next app' />
        <link
          rel='icon'
          href='https://cdn-icons-png.flaticon.com/512/564/564429.png'
        />
      </Head>
      <div className={styles.container}>
        <main>
          <div className={styles.container__calcDisplay}>
            {history}
            {message.length > 0 ? message : calc.num ? calc.num : calc.res}
          </div>
          <div className={styles.container__calcBody}>
            {calcButtons.flat().map((el, index) => (
              <button
                key={index}
                onClick={handleClick}
                className={styles.container__calcBody__calcButtons}
                value={el}>
                {" "}
                {el}
              </button>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}