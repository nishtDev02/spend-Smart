import Groq from 'groq-sdk'
import Income from "../models/Income_model.js";
import Expense from "../models/Expense_model.js";



export const getAllInsights = async (req, res) => {
  try {

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    
    // fetching user's income and expenses
    const incomes = await Income.find({ user: req.user._id });
    const expenses = await Expense.find({ user: req.user._id });

    // Calculating total
    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const savings = totalIncome - totalExpense;

    // category wise expense
    const categoryBreakdown = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
    }, {})

    // send prompt to gemini
    const prompt = `
      You are a personal financial advisor. Analyze the user's financial data and give 3-4 personalized, actionable insights in a friendly tone. Use Indian Rupee (₹).

      Financial Summary:
      - Total Income: ₹${totalIncome}
      - Total Expense: ₹${totalExpense}
      - Total Savings: ₹${savings}
      - Savings Rate: ${totalIncome ? ((savings / totalIncome) * 100).toFixed(1) : 0}%

      Expense Breakdown by Category:
      ${Object.entries(categoryBreakdown).map(([cat, amt]) => `- ${cat}: ₹${amt}`).join("\n")}

      Give specific advice based on their spending patterns. Be conversational and helpful. Format response as 3-4 short paragraphs.

    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    const insights = completion.choices[0]?.message?.content || ""

    res.status(200).json({
      summary: {
        totalIncome,
        totalExpense,
        savings,
        savingsRate: totalIncome
          ? ((savings / totalIncome) * 100).toFixed(1)
          : 0,
      },
      insights,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
