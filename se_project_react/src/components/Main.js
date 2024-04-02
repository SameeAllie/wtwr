import React, { useContext } from "react";
import CurrentTemperatureUnitContext from "../contexts/CurrentTemperatureUnitContext";
import WeatherCard from "../components/WeatherCard";
import ItemCard from "./ItemCard";
import { temperature } from "../utils/weatherApi";

import "../blocks/Main.css";
import "../blocks/Card.css";

function Main({
  onLike,
  onUnlike,
  weatherTemp,
  onSelectCard,
  clothingItems,
  isLoggedIn,
  filteredCards,
}) {
  const { currentTemperatureUnit } = useContext(CurrentTemperatureUnitContext);

  const getWeatherType = () => {
    if (weatherTemp >= 86) {
      return "hot";
    } else if (weatherTemp >= 66 && weatherTemp <= 85) {
      return "warm";
    } else if (weatherTemp <= 65) {
      return "cold";
    }
  };

  //I wanted to thank you for the help :)

  const weather = getWeatherType();
  const currentTemp = temperature(weatherTemp);
  const currentTempString = currentTemp[currentTemperatureUnit];
  const filteredClothingItems = clothingItems.filter((item) => {
    return item.weather === weather;
  });

  return (
    <main className="main">
      <div className="main__container">
        <WeatherCard day={true} type="sunny" weatherTemp={weatherTemp} />

        <section className="main__clothing">
          <p className="main__text">
            Today is {currentTempString} / You may want to wear:
          </p>

          <ul className="main__cards">
            {Array.isArray(filteredClothingItems) &&
              filteredClothingItems.map((item) => (
                <ItemCard
                  key={item._id}
                  item={item}
                  onSelectCard={onSelectCard}
                  onLike={onLike}
                  onUnlike={onUnlike}
                  isLoggedIn={isLoggedIn}
                />
              ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

export default Main;
