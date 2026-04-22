import Income from "../models/Income_model.js";

// create income
export const addIncome = async (req, res) => {
  try {
    const { amount, source, date } = req.body;

    const income = await Income.create({
      amount,
      source,
      date,
      user: req.user._id,
    });

    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update income
export const updateIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: "Income is invalid" });
    }

    // only owner can update income
    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedIncome = await Income.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(updatedIncome);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete income
export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: "Income is invalid" });
    }

    // only owner can delete income
    if (income.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Income.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Income deleted successfully!' })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get incomes
export const getIncome = async (req, res) => {
    try {
        const incomes = await Income.find({ user: req.user._id }).sort({
          createdAt: -1,
        });
    
        res.status(200).json(incomes);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}