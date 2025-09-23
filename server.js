// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// --- Simple mock classifier (replace with real ML model if desired) ---
function classifyMessage(text) {
  const lower = text.toLowerCase();
  
  if (lower.includes("bill") || lower.includes("invoice") || lower.includes("payment")) {
    return { category: "billing", confidence: 0.92 };
  } 
  if (lower.includes("error") || lower.includes("crash") || lower.includes("login")) {
    return { category: "technical", confidence: 0.88 };
  }
  return { category: "general", confidence: 0.85 };
}

// --- /predict endpoint ---
app.post("/predict", (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "No query provided" });
  }

  const prediction = classifyMessage(query);

  // 🎉 Cheerful tone responses
  const responses = {
    billing: [
      " Great question! I can help with billing. Could you tell me a bit more?",
      " I see this is about billing — let’s sort it out together!",
      " Billing matters are important. Let’s get you sorted right away!"
    ],
    technical: [
      " Looks like a tech hiccup! Don’t worry, we’ll fix this together.",
      " I caught that this is a technical issue. Let’s troubleshoot step by step!",
      " Oops, tech gremlins! Let’s make it right."
    ],
    general: [
      "Thanks for reaching out! I’d be happy to answer your question.",
      " That’s a great question! Let me guide you.",
      " Always happy to help — let’s go!"
    ]
  };

  const replyOptions = responses[prediction.category];
  const reply = replyOptions[Math.floor(Math.random() * replyOptions.length)];

  res.json({
    category: prediction.category,
    confidence: prediction.confidence,
    reply
  });
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
