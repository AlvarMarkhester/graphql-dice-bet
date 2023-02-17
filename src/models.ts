import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  DataTypes,
} from "sequelize"

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>
  declare name: string
  declare balance: number
}
export const UserFields = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  balance: {
    type: DataTypes.FLOAT,
  },
}

export class Bet extends Model<
  InferAttributes<Bet>,
  InferCreationAttributes<Bet>
> {
  declare id: CreationOptional<number>
  declare userId: ForeignKey<User["id"]>
  declare betAmount: Number
  declare chance: Number
  declare payout: Number
  declare win: boolean
}

export const BetFields = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
  },
  betAmount: {
    type: DataTypes.FLOAT,
  },
  chance: {
    type: DataTypes.FLOAT,
  },
  payout: {
    type: DataTypes.FLOAT,
  },
  win: {
    type: DataTypes.BOOLEAN,
  },
}
