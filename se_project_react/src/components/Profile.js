import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import ClothesSection from "./ClothesSection";
import { getForecastWeather } from "../utils/weatherApi";

const Profile = ({
  items,
  onCardClick,
  onAddClick,
  isLoggedIn,
  editClick,
  logoutClick,
  onLike,
  onUnlike,
  weatherTemp,
}) => {
  // const [weatherType, setWeatherType] = useState("");
  // useEffect(() => {
  //   getForecastWeather().then((data) => {
  //     const currentWeatherType = data.weather[0].main;
  //     setWeatherType(currentWeatherType);
  //   });
  // }, []);

  return (
    <section className="profile">
      <div className="profile__content">
        <SideBar
          isLoggedIn={isLoggedIn}
          editClick={editClick}
          logoutClick={logoutClick}
        />
        <div className="profile__info"></div>
        <ClothesSection
          cards={items}
          onCardClick={onCardClick}
          onAddClick={onAddClick}
          isLoggedIn={isLoggedIn}
          onLike={onLike}
          onUnlike={onUnlike}
          weatherTemp={weatherTemp}
        />
      </div>
    </section>
  );
};

export default Profile;
