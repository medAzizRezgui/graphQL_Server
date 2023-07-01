import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import 'dotenv/config'

// types
import { typeDefs } from "./schema.js";

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,}
  )
  .then((r) => console.log("Connected to DB"));

const Author = mongoose.model("author", { name: String, verified: Boolean });

const Game = mongoose.model("game", {
  title: String,
  platform: [String],
});

const Review = mongoose.model("review", {
  rating: Number,
  content: String,
  author_id: String,
  game_id: String,
});
const resolvers = {
  Query: {
    games: async () => await Game.find(),
    game: async (_, args) => await Game.findById(args.id),
    authors: async () => await Author.find(),
    author: async (_, args) => await Author.findById(args.id),
    reviews: async () => await Review.find(),
    review: async (_, args) => await Review.findById(args.id),
  },
  Game: {
    reviews: async (parent) => await Review.find({ game_id: parent.id }),
  },
  Review: {
    author: async (parent) => await Author.findById(parent.author_id),
    game: async (parent) => await Game.findById(parent.game_id),
  },

  Author: {
    reviews: async (parent) => await Review.find({ author_id: parent.id }),
  },
  Mutation: {
    addGame: async (_, args) => {
      const game = new Game(args.game);
      await game.save();
      return game;
    },
    addAuthor: async (_, args) => {
      const author = new Author(args.author);
      await author.save();
      return author;
    },
    addReview: async (_, args) => {
      const review = new Review(args.review);
      await review.save();
      return review;
    },
    deleteGame(_, ID) {
      let game = db.games.find((game) => game.id === ID);
      db.games.pop(game);
      return db.games;
    },
    updateGame(_, args) {
      db.games = db.games.map((g) => {
        if (g.id === args.id) {
          return { ...g, ...args.edits };
        }
        return g;
      });

      return db.games.find((g) => g.id === args.id);
    },
  },
};
// server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`Server ready at: ${url}`);
