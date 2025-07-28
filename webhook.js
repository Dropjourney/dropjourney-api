export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Only POST requests allowed." });
  }

  const { link } = req.body;

  if (!link) {
    return res.status(400).json({ error: "Missing link in request body." });
  }

  try {
    const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a luxury travel assistant." },
          { role: "user", content: `Create a simple trip plan based on this: ${link}` }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const gptData = await gptResponse.json();
    const message = gptData.choices[0]?.message?.content || "No trip generated.";

    return res.status(200).json({ trip: message });

  } catch (error) {
    return res.status(500).json({ error: "GPT fetch failed", detail: error.message });
  }
}
