import { Model, DataTypes, } from "sequelize";
export class User extends Model {
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
};
export class Bet extends Model {
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
};
