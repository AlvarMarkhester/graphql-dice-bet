import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { Sequelize } from "sequelize"
import { User, BetFields, Bet, UserFields } from "./models.js"
import {
  getUser,
  getUserList,
  getBet,
  getBestBetPerUser,
  getBetList,
  createBet,
} from "./services.js"
import { loadFiles } from "@graphql-tools/load-files"

const sequelize = new Sequelize("sqlite::memory:")
User.init(UserFields, { sequelize })
Bet.init(BetFields, { sequelize })

try {
  await sequelize.authenticate()
  console.log("Connection has been established successfully.")
} catch (error) {
  console.error("Unable to connect to the database:", error)
}

//TEST USER AND SYNC DB WITH IN MEMORY DB
await sequelize.sync()
await User.create({ name: "Alvar Markhester", balance: 100000 })
for (let i = 0; i < 50; i++) {
  await User.create({ name: i + " :) ", balance: 1500 })
}

//TEST CASES
for (let i = 0; i < 50; i++) {
  await Bet.create({
    betAmount: Math.random() * 1000,
    chance: Math.random(),
    payout: Math.random() * 20000,
    userId: i,
    win: Math.random() < 0.5 ? false : true,
  })
}

const typeDefs = await loadFiles("src/schema.graphql")

const resolvers = {
  Query: {
    getUser,
    getUserList,
    getBet,
    getBetList,
    getBestBetPerUser,
  },
  Mutation: {
    createBet,
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } })

console.log(`🚀 Server listening at: ${url}`)
