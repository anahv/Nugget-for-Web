import React, { useState, useEffect, Suspense, useCallback } from "react";
import api from "../api/api";

import Nugget2 from "./Nugget";
import CreateNugget from "./CreateNugget";
import Model from "./Model";
import Header from "./Header";
import Footer from "./Footer";
import CircularProgress from "./CircularProgress";

function App() {
  // const [modelsData, setModelsData] = useState([]);
  const [randomModel, setRandomModel] = useState([]);
  const [nuggets, setNuggets] = useState([]);

  function addNewNugget(newNugget) {
    setNuggets(prevValues => {
      return [...prevValues, newNugget];
    });
  }

  function deleteNugget(id) {
    api.deleteNuggetById(id)
    fetchNuggets()
  }

  // function editNugget(id) {
  //   api.updateNuggetById(id)
  //   fetchNuggets()
  //   console.log("called edit");
  // }

  useEffect(() => {
    fetchNuggets();
  }, []);

  async function fetchNuggets() {
    await api.getAllNuggets().then(nuggets => {
      setNuggets(nuggets.data.data);
    })
  };

  const fetchModel = useCallback(
    () =>
      fetch("https://nugget-api.herokuapp.com/nuggets")
        .then(results => results.json())
        .then(models => {
          let randomNumber = Math.floor(Math.random() * 113 + 1);
          // setModelsData(models);
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
      <CreateNugget addNewNugget={addNewNugget} />
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

      {nuggets.map(function(nugget) {
        return(
        <Nugget2
          nugget={nugget}
          key={nugget._id}
          title={nugget.title}
          content={nugget.content}
          deleteNugget={deleteNugget}
          id={nugget._id}
          // editNugget={editNugget}
        />)
      })}


      <Footer />
    </div>
  );
}

export default App;
