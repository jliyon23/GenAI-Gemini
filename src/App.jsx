import { useState, useEffect } from "react";
import axios from "axios";
import Typewriter from "typewriter-effect";
import { FaGithub } from "react-icons/fa";

function App() {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [displayedOutput, setDisplayedOutput] = useState("");
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT;

  const getResponse = async () => {
    setLoading(true);
    setError("");
    setOutput("");
    setDisplayedOutput("");
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: input }] }],
        },
      });
      console.log(response.data);
      setOutput(response.data.candidates[0].content.parts[0].text);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch response. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (output) {
      let index = 0;
      const outputParts = output.split(/(<.*?>| )/); // Splitting the HTML content by tags and spaces
      const displayNextPart = () => {
        if (index < outputParts.length) {
          setDisplayedOutput((prev) => prev + outputParts[index]);
          index++;
          setTimeout(displayNextPart, 50); // Adjust the delay for typing speed
        }
      };
      displayNextPart();
    }
  }, [output]);

  return (
    <div className="w-100 min-h-screen bg-slate-50 flex flex-col">
      <header>
        <div className="w-full flex flex-row justify-between p-4 bg-slate-900">
          <h1 className="text-4xl text-white font-bold">
            Gen<span className="text-cyan-400">AI</span>
          </h1>
          <a href="https://github.com/jliyon23/GenAI-Gemini" target="_blank" className="text-white text-3xl font-semibold"> <FaGithub/> </a>
        </div>
      </header>

      <main className="min-h-screen bg-slate-800">
        <div className="w-full flex flex-col p-4 items-center justify-center">
          <h1 className="text-4xl text-white text-center font-bold">
            Welcome to Gen<span className="text-cyan-400">AI</span>
          </h1>
          <p className="text-white text-center font-semibold">
            A simple gen AI that can help you with your daily tasks.
          </p>
        </div>
        {/* prompt input section  */}
        <div className="w-full flex flex-col md:flex-row gap-3 justify-center p-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-12 md:w-1/2 p-2 rounded-xl bg-slate-300"
            placeholder="Type something..."
          />
          <button
            onClick={getResponse}
            className="bg-gray-600 px-4 text-white p-2 rounded-lg"
          >
            Submit
          </button>
        </div>

        {/* result section  */}
        {loading ? (
          <div className="flex flex-col items-center p-4 gap-4 mt-4">
            <div className="animate-pulse bg-gray-300 h-5 w-full lg:w-1/2 xl:w-1/2 rounded-md"></div>
            <div className="animate-pulse bg-gray-300 h-10 w-full lg:w-1/2 xl:w-1/2 rounded-md"></div>
            <div className="animate-pulse bg-gray-300 h-32 w-full lg:w-1/2 xl:w-1/2 rounded-md"></div>
            <div className="animate-pulse bg-gray-300 h-32 w-full lg:w-1/2 xl:w-1/2 rounded-md"></div>
            <div className="animate-pulse bg-gray-300 h-32 w-full lg:w-1/2 xl:w-1/2 rounded-md"></div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center mt-4 p-4">
            {error ? (
              <div className="bg-red-500 text-white p-2 rounded-md">
                <Typewriter
                  options={{
                    strings: [error],
                    autoStart: true,
                    loop: true,
                    delay: 40,
                  }}
                />
              </div>
            ) : (
              <div className="bg-gray-900  rounded-md output text-white w-full lg:w-1/2 p-2">
                {
                  displayedOutput ? (
                    <div>
                      {displayedOutput}
                    </div>
                    // <div dangerouslySetInnerHTML={{ __html: displayedOutput }} />
                  ):(
                    <Typewriter
                      options={{
                        strings: ["Your output will appear here.", "It may take a few seconds."],
                        autoStart: true,
                        loop: true,
                        delay: 40,
                      }}
                    />
                  )
                }
                
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
