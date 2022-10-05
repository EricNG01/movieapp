//The Movie Database (TMDb)
import React, { useState } from 'react';
require("dotenv").config()
const fs = require('fs');

// TMDb logo
const TMDb_logo = "https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
const axios = require('axios');

// display a dummy image when the poster is not found
const noImg = 'https://dummyimage.com/400x600/000/fff.png&text=no+poster'

// const address = "52.63.115.99"
// const address = "127.0.0.1" 
const address = process.env.REACT_APP_ADDRESS
// const port = "3001"
// const PORT = "8080"
const port = process.env.REACT_APP_PORT

// defaultMoviesDisplay()
function DefaultMoviesDisplay() {
    

    // the state for the keyword search
    const [keyword, setKeyword] = useState("");

    // the state for information for all the searched movies
    const [movieInfo, setMovieInfo] = useState({});

    // the state for the preview title of each movie
    const [previewTitle, setPreviewTitle] = useState("");

    // the state to store the iframe element for each preview
    const [previewLayer, setPreviewLayer] = useState("");

    // the state to store the width of the ease in layer
    // this state is used in the css file
    const [overlayWidth, setOverlayWidth] = useState("0%");

    // the state to store all the review for each movie
    const [review, setReview] = useState("");

    // the state for the page counter
    const [count, setCount] = useState("")
    

    // function - page counter
    const getCounter = () => {
        axios(`http://${address}:${port}/counter/`)
        .then((res) => {
            console.log("Page counter: ", JSON.parse(res.data))
            setCount(JSON.parse(res.data))
        })
        .catch(err => console.log(err))
    }


    // the onclick function of the latest movie button
    // whenever it is clicked, the web app searches and display the latest movies
    const defaultSearch = (event) => {

        event.preventDefault();
        setMovieInfo({});

        axios(`http://${address}:${port}/default/`)

            .then((res) => {

                // the page counter function is called for each GET request
                getCounter();

                return res.data
            })

            .then((data) => {
                // console.log(data)
                console.log("Getting the latest movies")
                
                setMovieInfo(data)
            })

            .catch(err => console.log(err))
    }
    

    // function - search by keywords
    // the web app searches for the top 20 movies that include the keywords and most related to the keywords
    const keywordSearch = (event) => {

        event.preventDefault();
        setMovieInfo({});

        axios(`http://${address}:${port}/keyword/${keyword}`)

            .then((res) => {

                // the page counter function is called for each GET request
                getCounter();

                console.log(`Getting all movie related to ${keyword}`)
                return res.data
            })

            .then((data) => {
                // console.log(data)
                setMovieInfo(data)
            })

            .catch(err => console.log(err))
    }


    // function - more
    // a layer ease in, the preview from youtube and the movie reviews from New York Times are displayed in the new layer
    const handleMore = (event) => {

        event.preventDefault();

        // When user click the 'more' button of a movie, the scrollbar of the base layer will be hidden
        // and another layer will ease in. User can watch the preview and reviews of the movie in that layer
        document.getElementById('html').style.overflow = 'hidden'
        setOverlayWidth("100%")
        setPreviewTitle(event.currentTarget.id)
        
        
        // preview query - from youtube    
        axios(`http://${address}:${port}/preview/${event.currentTarget.id}`)
            .then((res) => {

                // the page counter function is called for each GET request
                getCounter();

                console.log(`Getting the preview from to Youtube`)
                return res.data
            })
            .then((data) => {

                if (data.length > 0) {
                    // console.log(data[0].link)

                    // The embedded youtube video element
                    setPreviewLayer(
                        <iframe 
                            width="560" 
                            height="315" 
                            src={data[0].link}
                            title="YouTube video player" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen
                            >

                        </iframe>
                    )
                }

                else {
                    setPreviewLayer(
                        <iframe 
                            width="560" 
                            height="315" 
                            title="No preview is found" 
                            >

                        </iframe>
                    )
                }
            })
            .catch(err => console.log(err))

        // review query - from New York Times
        axios(`http://${address}:${port}/review/${event.currentTarget.id}`)
        .then(res => {

            // The embedded youtube video element
            getCounter();

            console.log(`Getting the reviews from New York Times`)
            return res.data
        })
        .then((data) => {
            // console.log(data)
            var temp = []
            if (data.length > 0) {
                for(var i = 0; i < data.length; i++) {
                    temp.push(
                    <div 
                        class="review"
                        style={{
                            'color': '#fff',
                            'font-size': '20px',
                            'margin-left': '10%',
                            'margin-right': '10%',
                            'background-color': 'rgba(127, 127, 127, 0.3)',
                            'border': '2px solid rgb(255, 255, 255)'
                        }}>
                        <ul>
                            <div>Title: </div>
                            <div id="content"
                                style={{
                                'font-size': '15px'
                            }}>
                                {data[i].headline}
                            </div>
                        </ul>                        

                        <ul>
                            <div>Review: </div>
                            <div id="content"
                                style={{
                                'font-size': '15px'
                            }}>
                                {data[i].summay}
                            </div>
                        </ul>

                        <ul>
                            <div>Reviewer: </div>
                            <div id="content"
                                style={{
                                'font-size': '15px'
                            }}>
                                {data[i].reviewer}
                            </div>
                        </ul>
                        
                        <ul>
                            <div>Link to the article: </div>
                            <div id="content"
                                style={{
                                'font-size': '15px'
                            }}>
                                <a href={data[i].link}>{data[i].link}</a>
                            </div>
                        </ul>

                    </div>)
                }
            }
            else {
                temp.push(
                <div class="review"
                    style={{
                        'color': '#fff',
                        'font-size': '20px',
                        'margin-left': '10%',
                        'margin-right': '10%',
                        'background-color': 'rgba(127, 127, 127, 0.3)',
                        'border': '2px solid rgb(255, 255, 255)'
                    }}>
                    No review is found.
                </div>)
            }
            
            setReview(temp)
        })
        .catch(err => console.log(err))
    }

    return(
        <div>
            {/* Header */}
            <div>
                <header class="header">
                    <h1 id="header_bar">
                        <img 
                            src={TMDb_logo} 
                            alt="TMDb logo"
                            id="header_logo"
                            />
                    </h1>

                    <ul>
                        
                        <li>
                            <form>
                                <input 
                                    disabled
                                    id="counter"
                                    type="submit" 
                                    value={`Counter: ${count}`}
                                    />
                                <input 
                                    id="defaultSearch"
                                    onClick={defaultSearch} 
                                    type="submit" 
                                    value="Latest movies"
                                    />
                            </form>
                            <form>
                                <input
                                    type="text"
                                    placeholder="Search" 
                                    id="Search"
                                    class="search"
                                    onChange = {(e) => {setKeyword(e.target.value)}}
                                    />
                                <input
                                    type="submit"
                                    value="" 
                                    id="submit-button"
                                    class="search"
                                    onClick={keywordSearch}
                                    />
                            </form>
                        </li>
                    </ul>

                </header>
            </div>

            {/* Body */}
            <div id="body">                
                {(() => {
                    const movies = []
                    if (movieInfo.length > 0) {
                        for (var i = 0; i < movieInfo.length; i++) {
                        movies.push(

                        // push one movie per iteration (with those html elements)
                        <div class="movie">
                            <img src={movieInfo[i].poster? movieInfo[i].poster:noImg} alt={movieInfo[i].title} />
                            
                            <div class="movie-info">
                                <h3>{movieInfo[i].title}</h3>    
                            </div>
                            
                            <div class="overview">
                                <h3>Overview</h3>
                                <span>{movieInfo[i].overview}</span>
                                <br/>
                                <button 
                                    class='more' 
                                    id={movieInfo[i].title} 
                                    onClick={handleMore}>
                                        More
                                </button>
                            </div>
                        </div>

                        )
                        }
                        return movies;
                    }
                    else {
                        return <h1 id="no_result">No Result.</h1>
                    }
                    
                })()}
            </div>

            {/* Layer for the preview and review*/}
            <div id="myNav" class="overlay" style={{ 'width': overlayWidth }}>
                <div>
                    <button style={{
                        'color':'#fff',
                        'border':'none',
                        'background-color':'transparent',
                        'font-size':'100px',
                        'margin-left':'95%',
                        'cursor':'pointer'
                    }}
                    onClick={() => {
                        setOverlayWidth("0%")
                        document.getElementById('html').style.overflow='auto'
                        }}>
                        &times;
                    </button>
                </div>
                <div class="overlay-content">
                    <h2 style={{    
                            'color': '#fff',
                            'letter-spacing': '1.5px',
                            'font-size': '40px'}}
                            >
                                {previewTitle}
                            </h2>
                    {previewLayer}
                    <h3 style={{    
                            'color': '#fff',
                            'letter-spacing': '1.5px',
                            'font-size': '30px',
                            'margin-left': '10%',
                            'margin-right': '10%'}}
                            >
                            Reviews
                            </h3>
                            {review}
                    
                </div>
            </div>
        </div>
    )
}


export default function SearchKeyword() {
    return (
      <div>
        <DefaultMoviesDisplay />
      </div>  
    );
  }