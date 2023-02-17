import { GraphQLError } from "graphql"
import { Bet, User } from "./models.js"

// User Services

export function getUser(root, args, context, info) {
  return User.findOne({
    where: { id: args.id },
    attributes: ["id", "name", "balance"],
  }).then((user) => {
    if (!user) throw new GraphQLError("User does not exist")
    return user.dataValues
  })
}
export function getUserList() {
  return User.findAll({
    attributes: ["id", "name", "balance"],
  }).then((users) => {
    return users.map((user) => user.dataValues)
  })
}

//Bet services

export function getBet(root, args, context, info) {
  return Bet.findOne({
    where: { id: args.id },
    attributes: ["id", "betAmount", "userId", "payout", "chance", "win"],
  }).then((bet) => {
    if (!bet) throw new GraphQLError("Bet does not exist")
    return bet.dataValues
  })
}
export function getBetList() {
  return Bet.findAll({
    attributes: ["id", "betAmount", "userId", "payout", "chance", "win"],
  }).then((bets) => {
    return bets.map((bet) => bet.dataValues)
  })
}
export function getBestBetPerUser(root, args, context, info) {
  return Bet.findAll({
    attributes: ["id", "betAmount", "userId", "payout", "chance", "win"],
    order: [["payout", "DESC"]],
    limit: args.limit ? args.limit : undefined,
  }).then((bets) => {
    //Filter the bets for 1 unique bet per user
    let table = {}
    return bets
      .filter((bet) => {
        if (!(bet.userId in table)) {
          table[bet.userId] = true
          return true
        }
        return false
      })
      .map((bet) => bet.dataValues)
  })
}

export async function createBet(root, args, context, info) {
  const user = await User.findOne({
    where: { id: args.userId },
  })
  //ERROR HANDLING
  if (!user) {
    throw new GraphQLError("User does not exist")
  }
  if (user.dataValues.balance < args.betAmount)
    throw new GraphQLError("Not enough balance")
  if (args.betAmount <= 0) throw new GraphQLError("You cannot bet 0 or lower.")
  if (args.chance < 0 || args.chance > 100)
    throw new GraphQLError("Not allowed. Enter a chance between 0% and 100%.")

  //DEDUCT USER BET AMOUNT
  await user.decrement({ balance: args.betAmount })

  let win
  let payout
  const roll = Math.random() * 100

  if (roll <= args.chance) {
    win = true
    payout = (100 / args.chance) * args.betAmount
    await user.increment({ balance: payout })
  } else {
    win = false
    payout = 0
  }
  const newBet = await Bet.create({
    userId: args.userId,
    betAmount: args.betAmount,
    chance: args.chance,
    win,
    payout,
  })

  return newBet.dataValues
}
