const Book = require('../models/Book');

exports.getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, title, author, category } = req.query;
    
    let query = {};
    if (title) query.title = { $regex: title, $options: 'i' };
    if (author) query.author = { $regex: author, $options: 'i' };
    if (category) query.category = { $regex: category, $options: 'i' };
    
    const books = await Book.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
      
    const count = await Book.countDocuments(query);
    
    res.json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
