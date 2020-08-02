import React, { useState, useEffect, Suspense, useCallback } from "react";
import Nugget from "./Nugget";
import CreateNugget from "./CreateNugget";
import Model from "./Model";
import Header from "./Header";
import Footer from "./Footer";
import CircularProgress from "./CircularProgress";

function App() {
  const [modelsData, setModelsData] = useState([]);
  const [randomModel, setRandomModel] = useState([]);
  const [nuggets, setNuggets] = useState([]);

  function addNewNugget(newNugget) {
    setNuggets(prevValues => {
      return [...prevValues, newNugget];
    });
  }

  function deleteNugget(id) {
    setNuggets(prevValues => {
      return prevValues.filter((nugget, index) => {
        return index !== id;
      });
    });
  }

  const fetchModel = useCallback(
    () =>
      fetch("https://nugget-api.herokuapp.com/nuggets")
        .then(results => results.json())
        .then(models => {
          let randomNumber = Math.floor(Math.random() * 113 + 1);
          setModelsData(models);
          setRandomModel(models[randomNumber]);
        })
        .catch(error => {
          console.log("Error:" + error);
        }),
    []
  );

  useEffect(
    () => {
      fetchModel();
    },
    [fetchModel]
  );

  return (
    <div>
      <Header />
      <Suspense fallback={<CircularProgress />}>
        <Model
          key={randomModel.index}
          title={randomModel.title}
          content={randomModel.content}
          example={randomModel.example}
          id={randomModel.index}
          fetchModel={fetchModel}
        />
      </Suspense>
      <CreateNugget addNewNugget={addNewNugget} />
      {nuggets.map((nugget, index) => (
        <Nugget
          key={index}
          title={nugget.title}
          content={nugget.content}
          deleteNugget={deleteNugget}
          id={index}
        />
      ))}

      <Footer />
    </div>
  );
}

export default App;
