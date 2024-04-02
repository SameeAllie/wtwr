import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, useHistory } from "react-router-dom";
import CurrentTemperatureUnitContext from "../contexts/CurrentTemperatureUnitContext";
import { getForecastWeather, parseWeatherData } from "../utils/weatherApi";
import Header from "./Header";
import Main from "./Main";
import Footer from "../components/Footer";
import ItemModal from "./ItemModal";
import ModalWithDeleteConfirm from "./ModalWithDeleteConfirm";
import Profile from "../components/Profile";
import AddItemModal from "./AddItemModal";
import { itemsApi, userApi } from "../utils/api";
import ProtectedRoute from "./ProtectedRoute";
import { checkTokenValidity } from "../utils/auth";
import CurrentUserContext from "../contexts/CurrentUserContext";
import * as auth from "../utils/auth";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import MobileMenu from "./MobileMenu";
import LogoutModal from "./LogoutModal";
import EditModal from "./EditModal";
import { Switch } from "react-router-dom";

import "../blocks/App.css";
import "../blocks/Card.css";
import "../blocks/WeatherCard.css";
import "../blocks/MobileMenu.css";
import "../blocks/ModalConfirm.css";
import "../blocks/Body.css";
import "../blocks/ClothesSection.css";
import "../blocks/ItemCards.css";
import "../blocks/Page.css";
import "../blocks/SideBar.css";

const App = () => {
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const [clothingItems, setClothingItems] = useState([]);
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [temp, setTemp] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState({});
  const [token, setToken] = React.useState("");
  const history = useHistory();
  const [isLoading, setIsLoading] = React.useState(false);
  console.log(history);

  const handleSignIn = ({ email, password }) => {
    setIsLoading(true);

    auth
      .signIn({ email, password })
      .then((data) => {
        if (data.token) {
          return auth
            .checkTokenValidity(data.token)
            .then((response) => {
              setCurrentUser(response.data);
              setIsLoggedIn(true);
              history.push("/profile");
              handleCloseModal();
              setIsLoading(false);
            })
            .catch((error) => {
              console.log(error);
              setIsLoading(false);
            });
        } else {
          console.log("No token received");
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const handleRegister = (user) => {
    setIsLoading(true);

    auth
      .signUp(user)
      .then((response) => {
        if (response) {
          setCurrentUser(response.data);
          handleSignIn(user);
          handleCloseModal(); // Close the popup after a successful sign-up
          setIsLoading(false);
        } else {
          console.log("User registration failed:", response.error);
          setIsLoading(false); // Set isLoading to false even in case of error
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false); // Set isLoading to false in case of any error
      });
  };

  const handleSignout = () => {
    setCurrentUser({});
    setIsLoggedIn(false);
    localStorage.removeItem("jwt");
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setActiveModal("image");
  };

  const handleAddClick = () => {
    setActiveModal("add");
  };

  const handleCancel = () => {
    setActiveModal("image");
  };

  const handleSigninClick = () => {
    setActiveModal("login");
  };

  const handleSignoutClick = () => {
    setActiveModal("logout");
  };

  const handleEditClick = () => {
    setActiveModal("edit");
  };

  const handleRegisterClick = () => {
    setActiveModal("register");
  };

  const handleMobileClick = () => {
    setActiveModal("mobile");
  };

  const handleDeleteClick = (card) => {
    console.log(card._id);

    itemsApi
      .remove(card._id)
      .then(() => {
        console.log("Item deleted successfully");
        setClothingItems((clothingItems) =>
          clothingItems.filter((item) => item._id !== card._id)
        );
        handleCloseModal();
      })

      .catch((error) => {
        console.log("Error deleting item:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleOutClick = (evt) => {
    if (evt.target === evt.currentTarget) {
      handleCreateModal();
    }
  };

  const handleCreateModal = () => {
    setActiveModal("create");
  };

  const handleCloseModal = () => {
    setActiveModal("");
  };

  const handleSelectedCard = (card) => {
    console.log(card);
    setActiveModal("image");
    setSelectedCard(card);
  };

  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit((currentTempState) => {
      return currentTempState === "C" ? "F" : "C";
    });
  };

  const handleAddItemSubmit = ({ card }) => {
    const { name, imageUrl, weather } = card;
    setIsLoading(true);

    const newItem = {
      id: Date.now(),
      name,
      imageUrl,
      weather,
    };

    itemsApi
      .add(newItem)
      .then((response) => {
        console.log("Item added successfully:", response);
        setClothingItems((items) => [response.data, ...items]);
        handleCloseModal();
        setIsLoading(false); // Success, set isLoading to false
      })
      .catch((error) => {
        console.log("Error adding item:", error);
        setIsLoading(false); // Error occurred, set isLoading to false
      });
  };

  const handleEditSubmit = ({ name, avatarUrl }) => {
    setIsLoading(true);
    userApi
      .updateCurrentUser({ name, avatar: avatarUrl })
      .then((data) => {
        setIsLoading(false);
        setCurrentUser(data);
        handleCloseModal();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const handleDelete = (itemId) => {
    setActiveModal("confirm");
  };

  const handleLikeClick = (id, isLiked) => {
    console.log(id, isLiked);

    const token = localStorage.getItem("jwt");

    // Determine whether to like or unlike based on the current state
    if (isLiked) {
      // If the item is already liked, unlike it
      itemsApi
        .unlike(id, currentUser?._id)
        .then(({ data: updatedCard }) => {
          console.log("Card unliked:", updatedCard);
          setClothingItems((prevItems) =>
            prevItems.map((item) => (item._id === id ? updatedCard : item))
          );
        })
        .catch((err) => console.log(err));
    } else {
      // If the item is not liked, like it
      itemsApi
        .like(id)
        .then((updatedCard) => {
          console.log("Card liked:", updatedCard);
          setClothingItems((prevItems) =>
            prevItems.map((item) => (item._id === id ? updatedCard : item))
          );
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    getForecastWeather()
      .then((data) => {
        const temperature = parseWeatherData(data);
        setTemp(temperature);

        itemsApi
          .get()
          .then((response) => {
            console.log(response);
            setClothingItems(response);
          })
          .catch((error) => {
            console.log("Error adding item:", error);
          });
      })
      .catch((error) => {
        console.log("Error fetching weather data:", error);
      });

    const token = localStorage.getItem("jwt");
    if (token) {
      checkTokenValidity(token)
        .then((res) => {
          setIsLoggedIn(true);
          setCurrentUser(res.data);
        })
        .catch((error) => {
          console.error("Error checking token validity:", error);
        });
    }
  }, []);

  return (
    <BrowserRouter>
      <CurrentUserContext.Provider value={currentUser}>
        <CurrentTemperatureUnitContext.Provider
          value={{
            currentTemperatureUnit,
            handleToggleSwitchChange,
            parseWeatherData,
          }}
        >
          <Header
            parseWeatherData={parseWeatherData}
            handleClick={handleAddClick}
            handleMobile={handleMobileClick}
            handleSignIn={handleSigninClick}
            handleRegister={handleRegisterClick}
            isLoggedIn={isLoggedIn}
          />
          <Switch>
            <Route exact path="/">
              <Main
                weatherTemp={temp}
                onSelectCard={handleSelectedCard}
                clothingItems={clothingItems}
                isLoggedIn={isLoggedIn}
                onLike={handleLikeClick}
                onUnlike={handleLikeClick}
              />
            </Route>
            <ProtectedRoute path="/profile" isLoggedIn={isLoggedIn}>
              <Profile
                items={clothingItems}
                onCardClick={handleCardClick}
                onAddClick={handleAddClick}
                isLoggedIn={isLoggedIn}
                editClick={handleEditClick}
                logoutClick={handleSignoutClick}
                onLike={handleLikeClick}
                onUnlike={handleLikeClick}
                weatherTemp={temp}
              />
            </ProtectedRoute>
          </Switch>
          <Footer />

          {activeModal === "add" && (
            <AddItemModal
              handleCloseModal={handleCloseModal}
              isOpen={handleCreateModal}
              onAddItem={handleAddItemSubmit}
              handleOutClick={handleOutClick}
              token={token}
              isLoading={isLoading}
            />
          )}
          {activeModal === "confirm" && (
            <ModalWithDeleteConfirm
              onClose={handleCloseModal}
              onOutClick={handleOutClick}
              onCancel={handleCancel}
              onDelete={handleDeleteClick}
              card={selectedCard}
              isLoading={isLoading}
            />
          )}
          {activeModal === "image" && (
            <ItemModal
              selectedCard={selectedCard}
              onClose={handleCloseModal}
              onDeleteClick={handleDelete}
              onOutClick={handleOutClick}
              isLoggedIn={isLoggedIn}
            />
          )}
          {activeModal === "login" && (
            <LoginModal
              onClose={handleCloseModal}
              handleRegisterClick={handleRegisterClick}
              handleOutClick={handleOutClick}
              handleSignin={handleSignIn}
              isLoading={isLoading}
            />
          )}
          {activeModal === "register" && (
            <RegisterModal
              onClose={handleCloseModal}
              handleOutClick={handleOutClick}
              handleSigninClick={handleSigninClick}
              isLoading={isLoading}
              handleRegister={handleRegister}
            />
          )}
          {activeModal === "edit" && (
            <EditModal
              handleCloseModal={handleCloseModal}
              handleOutClick={handleOutClick}
              handleEdit={handleEditSubmit}
              isLoading={isLoading}
            />
          )}
          {activeModal === "logout" && (
            <LogoutModal
              handleCloseModal={handleCloseModal}
              handleOutClick={handleOutClick}
              logout={handleSignout}
            />
          )}
          {activeModal === "mobile" && (
            <MobileMenu
              onClose={handleCloseModal}
              onOutClick={handleOutClick}
              handleClick={handleAddClick}
              isLoggedIn={isLoggedIn}
              handleSignin={handleSigninClick}
              handleRegister={handleRegisterClick}
            />
          )}
        </CurrentTemperatureUnitContext.Provider>
      </CurrentUserContext.Provider>
    </BrowserRouter>
  );
};

export default App;
