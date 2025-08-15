

import { createContext, useState } from "react";
import { getResponse } from '../config/api';

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

const delaypara = (index, nextWord, callback) => {
  setTimeout(() => {
    callback(prev => prev + nextWord);
  }, 50 * index); // Adjust speed here
};

const onSent = async (prompt) => {
  setResultData("");
  setLoading(true);
  setShowResult(true);
  setRecentPrompt(input);

  try {
    const response = await getResponse(input);
    if (!response) {
      setResultData("❌ Sorry, something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    // Example formatting: replace **text** with <b>text</b> and * with <br>
    let formattedResponse = response
      .split("**")
      .map((part, i) => (i % 2 === 1 ? `<b>${part}</b>` : part))
      .join(" ")
      .split("*")
      .join("<br>");

    // Split by spaces for typing effect
    let words = formattedResponse.split(" ");

    setResultData(""); // clear first

    words.forEach((word, i) => {
      delaypara(i, word + " ", setResultData);
    });

  } catch (error) {
    setResultData("❌ An error occurred while fetching the response.");
    console.error(error);
  } finally {
    setLoading(false);
    setInput("");
  }
};


  const contextValue = {
    prevPrompt,
    setPrevPrompt,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;




