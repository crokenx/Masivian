import express from "express";
import client from "../db/redis";
import { v4 as uuid } from "uuid";
import { Bet } from "../model/model";
const router = express.Router();
router.get("/createRoulette", (req: any, res: any) => {
  const roulette_id: string = uuid();
  client.hset("roulettes", roulette_id, "close", (err: any, reply: any) => {
    if (err) return res.status(400).json(err);
    res.status(201).json({ roulette_id, message: "creation OK" });
  });
});
router.get("/getRoulettes", (req, res) => {
  client.hgetall("roulettes", (err: any, reply: any) => {
    if (err) return res.status(400).json(err);
    res.status(201).json(reply);
  });
});
router.post("/openRouletteById/:id", (req: any, res: any) => {
  const roulette_id: string = req.params.id;
  client.hset("roulettes", roulette_id, "open", (err: any, reply: any) => {
    if (err) return res.status(400).json(err);
    res.status(201).json({ roulette_id, message: "roulette is running" });
  });
});
router.post("/makeBet", async (req: any, res: any) => {
  if (!req.headers.user_id)
    return res
      .status(400)
      .json({ message: "invalid user_id/headers missing user_id" });
  const user_id = req.headers.user_id;
  const { value, colour, betNumber } = req.body;
  if (betNumber > 36 || betNumber < 0)
    return res.status(400).json({ message: "numero de apuesta invalido" });
  const betRoulette_id = await getOpenRoulette_id();
  const userBet = { user_id, value, colour, betNumber, betRoulette_id };
  const bet_id = uuid();
  client.hset("bets", bet_id, JSON.stringify(userBet), (err, reply) => {
    if (err) return res.status(400).json(err);
    res.status(201).json({ bet_id, apuesta: userBet });
  });
});
router.post("/closeRouletteById/:id", (req, res) => {
  const roulette_id = req.params.id;
  const rouletteNumber = Math.floor(Math.random() * (36 - 0 + 0)) + 0;
  const bettingResults: Bet[] = [];
  client.hgetall("bets", async (err_, bets) => {
    await Promise.all(
      Object.values(bets).map((bet) => {
        const BET = JSON.parse(bet);
        const betRoulette_id = BET.betRoulette_id;
        if (betRoulette_id === roulette_id) {
          const betResult = bettingEvaluation(
            rouletteNumber,
            BET.number,
            BET.value,
            BET.colour
          );
          bettingResults.push(betResult);
        }
      })
    );
    client.hset("roulettes", roulette_id, "close", (err: any, reply: any) => {
      if (err) return res.status(400).json(err);
    });
    res.status(201).json(bettingResults);
  });
});
const bettingEvaluation = (
  rouletteNumber: number,
  betNumber: number,
  bet: number,
  betColour: string
) => {
  const rouletteColour = rouletteNumber % 2 === 1 ? "black" : "red";
  if (betNumber === rouletteNumber) {
    return {
      result: "Ganador!!",
      bet,
      payment: bet * 5,
      betNumber,
      rouletteNumber,
      rouletteColour,
    };
  }
  if (betColour === rouletteColour) {
    return {
      result: "Ganador con color!!",
      bet,
      payment: bet * 1.8,
      betColour,
      rouletteNumber,
      rouletteColour,
    };
  }
  return {
    result: "Vuelve a intentarlo",
    bet,
    betNumber,
    betColour,
    rouletteNumber,
    rouletteColour,
  };
};
const getOpenRoulette_id = () => {
  return new Promise((resolve, reject) => {
    client.hgetall("roulettes", (err_: any, reply_: any) => {
      for (const roulette_id of Object.keys(reply_)) {
        client.hget("roulettes", roulette_id, (err: any, reply: any) => {
          if (reply === "open") resolve(roulette_id);
        });
      }
    });
  });
};
export = router;
