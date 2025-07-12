import React, { useEffect, useState } from "react";
import "./Home.css";

const Home = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [length, setlength] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });
      {
        console.log(input);
      }
      const data = await response.json();
      setLoading(false);
      setOutput(data.summary);
    } catch (err) {
      console.log(err);
      throw new Error("Failed to fetch");
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([output], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "summary.txt";
    document.body.appendChild(element); // Required for Firefox
    element.click();
    document.body.removeChild(element);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setInput(event.target.result);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid .txt file");
    }
  };

  const copyFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setInput(clipboardText);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
      alert("Clipboard access was denied. Please allow clipboard permissions.");
    }
  };

  const handleReadAloud = () => {
  if (!output) return;

  // Stop any current speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(output);
  utterance.lang = 'en-US';
  utterance.rate = 1; // Speed (0.1 to 10)
  utterance.pitch = 1; // Voice pitch (0 to 2)

  window.speechSynthesis.speak(utterance);
};

  useEffect(() => {
    const inputLen = input.trim().length;
    setlength(inputLen);
  }, [input]);
  useEffect(() => {
      window.speechSynthesis.cancel();

  }, [])
  
  return (
    <div className="container">
      <div className="heading">Free Text Summarizer</div>
      <div className="main">
        <div className="sidebar">
          {/* Hidden file input */}
          <input
            type="file"
            accept=".txt"
            id="hiddenFileInput"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />

          {/* Button triggers the hidden input */}
          <button
            onClick={() => document.getElementById("hiddenFileInput").click()}
            className="upload-btn"
            style={{marginBottom:"1rem"}}
          >
            <i className="fa-solid fa-upload" style={{ color: "#e8565b" }}></i>
          </button>
          <button
            onClick={handleReadAloud}
            className="read-btn"
          >
            <i className="fa-solid fa-volume-high" style={{ color: "#0583f2" }}></i>
          </button>
        </div>

        <div className="right">
          <div className="right-top">
            {loading && <div className="loader">Summarizing...</div>}
          </div>
          <div className="right-bottom">
            <div className="input-section">
              {input.length < 2 ? (
                <div className="clipboard" onClick={copyFromClipboard}>
                  <i class="fa-solid fa-clipboard"></i>
                  Paste Text
                </div>
              ) : (
                ""
              )}

              <textarea
                name="input"
                id="input-area"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                style={{
                  height: "80%",
                  width: "92%",
                  padding: "1rem",
                  fontSize: "1.0rem",
                }}
                placeholder="Enter or paste your text and press 'Summarize.' "
              ></textarea>
              <div className="input-section-bottom">
                <p>Characters: {length}</p>
                <div>
                  <button onClick={handleSubmit} className="summarize">
                    <i
                      class="fa-solid fa-check"
                      style={{ marginRight: "0.4rem" }}
                    ></i>
                    Summarize
                  </button>
                  <button
                    onClick={() => {
                      setInput("");
                      setOutput("");
                    }}
                    className="clear"
                  >
                    <i
                      class="fa-solid fa-eraser"
                      style={{ marginRight: "0.4rem" }}
                    ></i>
                    Clear
                  </button>
                </div>
              </div>
            </div>
            <div className="output-section">
              <textarea
                name=""
                id=""
                value={output}
                style={{
                  height: "80%",
                  width: "92%",
                  padding: "1rem",
                  fontSize: "1.0rem",
                }}
              ></textarea>
              <div className="input-section-bottom">
                <p>Characters: {output.trim().length}</p>
                <div>
                  <button
                    onClick={handleDownload}
                    disabled={!output}
                    className="download"
                  >
                    <i
                      class="fa-solid fa-circle-down"
                      style={{ marginRight: "0.4rem" }}
                    ></i>
                    Download
                  </button>
                  {/* <button
                    onClick={() => {
                    //   setInput("");
                      setOutput("");
                    }}
                    className="clear"
                  >
                    Clear
                  </button> */}
                </div>
              </div>
            </div>
            {/* <textarea name="" id=""></textarea> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
