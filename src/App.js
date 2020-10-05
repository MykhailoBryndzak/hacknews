import React, {useEffect, useState} from "react";
import "./App.css";

function App() {
  const [topIdList, setTopIdList] = useState([]);
  const [topStoryList, setTopStoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty&orderBy=\"$key\"&limitToFirst=10")
      .then(response => response.json())
      .then((data = []) => {
        setTopIdList(data);
      });
  }, []);

  useEffect(() => {
    setIsLoading(true)
    const findAnyName = async () => {
      try {
        let res = await Promise.all(topIdList.map(id => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)));
        let resJson = await Promise.all(res.map(e => e.json()));
        resJson = resJson.map(e => {
          return e;
        });
        setTopStoryList(resJson);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    findAnyName();
  }, [topIdList]);

  const renderListOfStories = () => {
    return topStoryList
      .sort((a, b) => a.score - b.score)
      .map(item => {
        const {title, url, time, score, id} = item;
        return (
          <div key={id} className="story-wrapper">
            <span className="story-item title">Title: {title}</span>
            <span className="story-item">URL: <a href={url} target="_blank" rel="noopener noreferrer">{url}</a></span>
            <span className="story-item">Time: {new Date(time * 1000).toLocaleDateString("en-US")}</span>
            <span className="story-item">Score: {score}</span>
          </div>
        );
      });
  };

  return (
    <div className="app-wrapper">
      {
        isLoading
          ? <h1>Loading...</h1>
          : renderListOfStories()
      }
    </div>
  );
}

export default App;
