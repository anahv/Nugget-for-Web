import React, { useState, useEffect, useContext } from "react";
import api from "../api/api";
import Nugget from "./Nugget";
import CreateNugget from "./CreateNugget";
import Model from "./Model";
import LinearProgress from "@material-ui/core/LinearProgress";
import StackGrid from "react-stack-grid";
import AppContext from "../libs/contextLib";
import NuggetModal from "./NuggetModal";
import useSize from "../libs/useSize";

function App() {
  // const [modelsData, setModelsData] = useState([]);
  const [randomModel, setRandomModel] = useState([]);
  const [nuggets, setNuggets] = useState([]);
  const [modelsAreLoading, setModelsAreLoading] = useState(false);
  const { userId } = useContext(AppContext);
  const [nuggetsAreLoading, setNuggetsAreLoading] = useState(false);
  const screen = useSize();
  const [showModal, setShowModal] = useState(false);
  const [clickedNugget, setClickedNugget] = useState({});

  function addNewNugget(newNugget) {
    setNuggets(prevValues => {
      return [...prevValues, newNugget];
    });
  }

  function deleteNugget(nuggetId) {
    const payload = { nuggetId };
    api.deleteUserNugget(userId, payload);
    fetchNuggets();
  }

  async function fetchNuggets() {
    setNuggetsAreLoading(true);
    await api.getUserNuggets(userId).then(nuggets => {
      setNuggets(nuggets.data.data);
      setNuggetsAreLoading(false);
    });
  }

  async function fetchModel() {
    setModelsAreLoading(true);
    await fetch("https://mental-models.herokuapp.com/nuggets")
      .then(results => results.json())
      .then(models => {
        let randomNumber = Math.floor(Math.random() * 113 + 1);
        // setModelsData(models);
        setRandomModel(models[randomNumber]);
        setModelsAreLoading(false);
      })
      .then(fetchNuggets())
      .catch(error => {
        console.log("Error:" + error);
      });
  }

  useEffect(() => {
    fetchModel();
  }, []);

  function handleOpenModal(clickedNugget) {
    setShowModal(true);
    setClickedNugget(clickedNugget);
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  return (
    <div>
      {nuggetsAreLoading && <LinearProgress />}
      {modelsAreLoading && <LinearProgress />}

      <CreateNugget addNewNugget={addNewNugget} />

      <NuggetModal
        show={showModal}
        onHide={handleCloseModal}
        title={clickedNugget.title}
        content={clickedNugget.content}
        key={clickedNugget._id}
        backgroundColor={clickedNugget.color}
      />

      <StackGrid
        columnWidth={screen.width <= 647 ? "100%" : 300}
        gutterWidth={15}
        gutterHeight={15}
      >
        <Model
          key={randomModel.index}
          title={randomModel.title}
          content={randomModel.content}
          example={randomModel.example}
          id={randomModel.index}
          fetchModel={fetchModel}
        />

        {nuggets.map(function(nugget) {
          return (
              <Nugget
                date={nugget.date}
                nugget={nugget}
                key={nugget._id}
                title={nugget.title}
                content={nugget.content}
                deleteNugget={deleteNugget}
                handleOpenModal={handleOpenModal}
                id={nugget._id}
              />
          );
        })}
      </StackGrid>
    </div>
  );
}

// import SearchBar from "./SearchBar";

// <SearchBar filterNuggets={filterNuggets} fetchNuggets={fetchNuggets}/>

// async function filterNuggets(filter) {
//   console.log("filterNuggets in the App.js called with filter " + filter);
//   await api.filterNuggets(filter).then(nuggets => {
//     setNuggets(nuggets.data.data);
//   });
// }

export default App;
