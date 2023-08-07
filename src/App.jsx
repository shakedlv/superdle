import React from 'react';
import './App.css';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { IoMdFemale, IoMdMale } from 'react-icons/io'
import PublisherIcon from './components/PublisherIcon';

function App() {
  const [heroes, setHeroes] = useState({})
  const [loaded, setLoaded] = useState(false)

  const [turn, setTurn] = useState(1)

  const [currentPick, setCurrentPick] = useState(0) // id of picked hero
  const [foundWord, setFoundWord] = useState(false)

  // Fetch heroes from API or storage
  useEffect(() => {
    if (localStorage.getItem("heroes") !== null) {
      console.log("Loaded from storage")
      setHeroes(JSON.parse(localStorage.getItem("heroes")))
    }
    else {
      const options = {
        method: 'GET',
        url: 'https://superhero-search.p.rapidapi.com/api/heroes',
        headers: {
          'X-RapidAPI-Key': '4608057fbdmsh7863c102fe983e4p1476d3jsnae9e2415ff83',
          'X-RapidAPI-Host': 'superhero-search.p.rapidapi.com'
        }
      };

      axios(options).then((result) => {
        localStorage.setItem("heroes", JSON.stringify(result.data))
        console.log("Loaded from api")

        setHeroes(result.data)
      }).catch((err) => {
        console.log(err)
      })
    }


  }, [])

  //pick random  hero 
  useEffect(() => {
    setCurrentGuess("")

    setLoaded(heroes.length > 0);
    setCurrentPick(Math.floor(Math.random() * heroes.length));
    setCurrentGuess("")

  }, [heroes])
  //store string guess
  const [currentGuess, setCurrentGuess] = useState('')

  const handleKeyup = ({ key }) => {
    if (key === 'Backspace') {
      if (currentGuess.length > 0) document.getElementById(turn + "-" + (currentGuess.length - 1)).placeholder = ""
      else document.getElementById(turn + "-0").placeholder = ""

      if (currentGuess.length > 0) {
        setCurrentGuess(prev => prev.slice(0, -1))
      }

      return
    }
    if (/^[A-Za-z0-9-]$/.test(key)) {
      if (currentGuess.length < heroes[currentPick]['name'].replace(/ /g, '').length) {
        console.log(key)
        setCurrentGuess(prev => prev + key)
        document.getElementById(turn + "-" + currentGuess.length).placeholder = key.toUpperCase(); // set letter inside box

      }
    }

    if (key === 'Enter') {
      if (currentGuess.length === heroes[currentPick]['name'].replace(/ /g, '').length) {
        HandleCheck();
        setTurn((prev) => prev + 1)
        setCurrentGuess("")
      }
    }
  }


  useEffect(() => {
    window.addEventListener('keyup', handleKeyup)

    return () => window.removeEventListener('keyup', handleKeyup)
  }, [handleKeyup])


  const HandleCheck = () => {
    var flag = true;
    var pick = heroes[currentPick]['name'].toLowerCase().replace(/ /g, '');
    for (let i = 0; i < currentGuess.length; i++) {
      if (pick[i] === currentGuess[i]) {
        document.getElementById(turn + "-" + i).classList.add("correct")
      }
      else if (pick.indexOf(currentGuess[i]) > -1) {
        document.getElementById(turn + "-" + i).classList.add("exist")
        flag = false;
      }
      else {
        flag = false;
      }
    }
    setFoundWord(flag);

  }

  useEffect(() => {
    if (foundWord) alert("won");
  }, [foundWord])

  useEffect(() => {
      if(turn === 6)
      {
        if(!foundWord) alert("lost");
      }
  }, [turn])
  


  return (
    <>
      <header >
        <span className='textlogo'>superdle</span>
        
      </header>
      {loaded ?
        <div  style={{minHeight:"70dvh",minWidth:"70dvh"}}>
          <div style={{display:'flex',flexDirection:"row","gap":"12px",justifyContent:"center","alignItems":"center"}}>
            <p className={'gender'}>
              {heroes[currentPick]['appearance']['gender'] === "Male" ? <IoMdMale /> : <IoMdFemale />}
            </p>
            <PublisherIcon publisher={heroes[currentPick]['biography']['publisher']}/>
            <p className={'gender'}>
              <span>{heroes[currentPick]['name'].split(" ").length}</span>
            </p>
          </div>
          <img className='img' style={{ filter: `blur(${6-turn}px)` }} 
            src={heroes[currentPick]['images']['sm']} alt={heroes[currentPick]['name'] + "Profile Photo"} />
          <div id='gameGrid'>
            <div>
              {heroes[currentPick]['name'].replace(/ /g, '').split("").map((l, index) => { return <input key={index} id={1 + "-" + index} type='text' disabled /> })}
            </div>
            <div>
              {heroes[currentPick]['name'].replace(/ /g, '').split("").map((l, index) => { return <input key={index} id={2 + "-" + index} type='text' disabled /> })}
            </div>
            <div>
              {heroes[currentPick]['name'].replace(/ /g, '').split("").map((l, index) => { return <input key={index} id={3 + "-" + index} type='text' disabled /> })}
            </div>
            <div>
              {heroes[currentPick]['name'].replace(/ /g, '').split("").map((l, index) => { return <input key={index} id={4 + "-" + index} type='text' disabled /> })}
            </div>
            <div>
              {heroes[currentPick]['name'].replace(/ /g, '').split("").map((l, index) => { return <input key={index} id={5 + "-" + index} type='text' disabled /> })}
            </div>
          </div>
        </div>
        : <p>No Data</p>}
    </>
  );
}

export default App;
