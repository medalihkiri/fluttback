const Reservation = require('../models/Reservation');
const Book = require('../models/Book');

exports.createReservation = async (req, res) => {
  try {
    const { bookId } = req.body;
    
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    
    if (!book.isAvailable) {
      return res.status(400).json({ message: 'Book is not available for reservation' });
    }
    
    // Update book status
    book.isAvailable = false;
    book.reservedBy = req.user.id;
    await book.save();
    
    const reservation = new Reservation({
      userId: req.user.id,
      bookId
    });
    
    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyReservations = async (req, res) => {
  try {
    // Find active reservations for the user
    const reservations = await Reservation.find({ 
      userId: req.user.id, 
      status: 'active' 
    }).populate('bookId');
    
    // Extract only the book data for display
    const books = reservations.map(r => {
      const book = r.bookId.toObject();
      book.reservationId = r._id; // Add reservation ID for cancelling
      return book;
    });
    
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { id } = req.params; // Reservation ID or Book ID? Let's use Book ID for easier frontend access
    
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    
    if (book.reservedBy?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You cannot return a book you did not reserve' });
    }

    // Update book
    book.isAvailable = true;
    book.reservedBy = null;
    await book.save();

    // Mark reservation as returned
    await Reservation.updateMany(
      { userId: req.user.id, bookId: id, status: 'active' }, 
      { status: 'returned' }
    );

    res.json({ message: 'Book returned successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
