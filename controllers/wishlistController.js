const Wishlist = require('../models/Wishlist');

exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id }).populate('bookIds');
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.id, bookIds: [] });
      await wishlist.save();
    }
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.id, bookIds: [bookId] });
    } else {
      if (!wishlist.bookIds.includes(bookId)) {
        wishlist.bookIds.push(bookId);
      }
    }
    
    await wishlist.save();
    
    // Return populated wishlist for frontend
    const populatedWishlist = await Wishlist.findById(wishlist._id).populate('bookIds');
    res.status(201).json(populatedWishlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params; // bookId
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    
    if (wishlist) {
      wishlist.bookIds = wishlist.bookIds.filter(bId => bId.toString() !== id);
      await wishlist.save();
    }
    
    const populatedWishlist = await Wishlist.findById(wishlist._id).populate('bookIds');
    res.json(populatedWishlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
