import React, { useState } from "react";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import { Button, TextField } from "@mui/material";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
});

function YoutubeToMp3Component() {
  const classes = useStyles();
  const [videoURL, setVideoURL] = useState("");
  const [videoData, setVideoData] = useState(null);

  const handleURLChange = (event) => {
    setVideoURL(event.target.value);
  };

  const handleConvert = async () => {
    const videoURL1 = videoURL;
    const searchParams = new URLSearchParams(new URL(videoURL1).search);
    const videoID = searchParams.get("v"); // AbcDeFgHiJk

    // Fetch video data using YouTube API
    const API_KEY = process.env.REACT_APP_API_KEY;
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID}&key=${API_KEY}`
    );
    const videoDetails = response.data.items[0].snippet;
    setVideoData(videoDetails);

    const test = await axios
      .get(`https://convert2mp3s.com/api/button/mp4?url=${videoURL1}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div className={classes.root}>
        <TextField
          value={videoURL}
          onChange={handleURLChange}
          variant="outlined"
          placeholder="Enter Youtube URL"
        />
        <Button
          style={{ marginTop: "1em" }}
          variant="contained"
          onClick={handleConvert}
        >
          Convert
        </Button>
      </div>
      {videoData && (
        <div>
          <img src={videoData.thumbnails.default.url} alt={videoData.title} />
          <p>{videoData.title}</p>
        </div>
      )}
    </div>
  );
}

export default YoutubeToMp3Component;
