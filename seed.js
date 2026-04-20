require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/Book');

const books = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    year: 1925,
    summary: "A novel about the American Dream in the 1920s.",
    category: "Fiction",
    isbn: "9780743273565",
    isAvailable: true
  },
  {
    title: "1984",
    author: "George Orwell",
    year: 1949,
    summary: "A dystopian social science fiction novel and cautionary tale.",
    category: "Science Fiction",
    isbn: "9780451524935",
    isAvailable: true
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    year: 1960,
    summary: "A novel about racial injustice and the loss of innocence.",
    category: "Fiction",
    isbn: "9780061120084",
    isAvailable: true
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    year: 1988,
    summary: "A popular-science book on cosmology.",
    category: "Science",
    isbn: "9780553380163",
    isAvailable: true
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    year: 2019,
    summary: "A psychological thriller about a woman's act of violence against her husband.",
    category: "Thriller",
    isbn: "9781250301697",
    isAvailable: true
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    year: 2011,
    summary: "A book exploring the history of humankind from the Stone Age to the 21st century.",
    category: "History",
    isbn: "9780062316097",
    isAvailable: true
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    year: 1937,
    summary: "A children's fantasy novel following the quest of home-loving Bilbo Baggins.",
    category: "Fantasy",
    isbn: "9780547928227",
    isAvailable: true
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    year: 1988,
    summary: "A story about following one's dreams and listening to one's heart.",
    category: "Adventure",
    isbn: "9780062315007",
    isAvailable: true
  },
  {
    title: "Educated",
    author: "Tara Westover",
    year: 2018,
    summary: "A memoir about a woman who leaves her survivalist family to pursue an education.",
    category: "Biography",
    isbn: "9780399590504",
    isAvailable: true
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    year: 2018,
    summary: "An easy and proven way to build good habits and break bad ones.",
    category: "Self-Help",
    isbn: "9780735211292",
    isAvailable: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/library');
    console.log("Connected to MongoDB for seeding...");

    // Optional: Clear existing books if you want a fresh start
    // await Book.deleteMany({});
    // console.log("Cleared existing books.");

    const existingCount = await Book.countDocuments();
    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} books. Skipping seeding to prevent duplicates.`);
      console.log("To force re-seeding, manually clear the 'books' collection in MongoDB.");
    } else {
      await Book.insertMany(books);
      console.log("Successfully seeded 10 books!");
    }

    mongoose.connection.close();
    console.log("Connection closed.");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
