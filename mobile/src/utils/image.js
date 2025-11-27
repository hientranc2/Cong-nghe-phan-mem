import berrySoda from "../assets/bery.jpg";
import burgerBlaze from "../assets/burger.jpg";
import coldBrewOrange from "../assets/camxa.jpg";
import espresso from "../assets/expresso.jpg";
import wingsHoney from "../assets/canhgabo.jpg";
import doubleCheese from "../assets/cheese.jpg";
import mocktailSunrise from "../assets/matcha.jpg";
import spicyFriedChicken from "../assets/garancay.jpg";
import parmesanTwists from "../assets/gavien.jpg";
import seafoodPizza from "../assets/haisan.jpg";
import tacosFiesta from "../assets/tacos.jpg";
import truffleBurger from "../assets/phomaixanh.jpg";
import trufflePizza from "../assets/pizzanam.jpg";
import lavaCheesePizza from "../assets/pizzaphomai.jpg";
import veggieMedley from "../assets/raucu.jpg";
import tempuraShrimp from "../assets/tomchien.jpg";
import peachTea from "../assets/tradao.jpg";
import misoBurger from "../assets/miso.jpg";

const assetMap = {
  "bery.jpg": berrySoda,
  "burger.jpg": burgerBlaze,
  "camxa.jpg": coldBrewOrange,
  "expresso.jpg": espresso,
  "canhgabo.jpg": wingsHoney,
  "cheese.jpg": doubleCheese,
  "matcha.jpg": mocktailSunrise,
  "garancay.jpg": spicyFriedChicken,
  "gavien.jpg": parmesanTwists,
  "haisan.jpg": seafoodPizza,
  "tacos.jpg": tacosFiesta,
  "phomaixanh.jpg": truffleBurger,
  "pizzanam.jpg": trufflePizza,
  "pizzaphomai.jpg": lavaCheesePizza,
  "raucu.jpg": veggieMedley,
  "tomchien.jpg": tempuraShrimp,
  "tradao.jpg": peachTea,
  "miso.jpg": misoBurger,
};

export const resolveImageSource = (value) => {
  if (!value) {
    return undefined;
  }

  if (typeof value === "string") {
    const normalized = value.trim();
    const fileName = normalized.split("/").pop();

    if (fileName && assetMap[fileName]) {
      return assetMap[fileName];
    }

    return { uri: normalized };
  }

  return value;
};