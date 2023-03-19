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
  download: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "1em",
  },
});

function YoutubeToMp3Component() {
  const classes = useStyles();
  const [videoURL, setVideoURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleURLChange = (event) => {
    setVideoURL(event.target.value);
  };

  const handleConvert = async () => {
    setLoading(true);

    await axios
      .post(
        "/api/convert",
        { url: videoURL },
        {
          responseType: "blob",
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
          onDownloadProgress: (event) => {
            const percentCompleted = Math.round(
              (event.loaded * 100) / event.total
            );
            setProgress(percentCompleted);
          },
        }
      )
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "output.mp3");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => {
        alert("Error converting the video.");
      })
      .finally(() => {
        setLoading(false);
        setProgress(0);
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
          disabled={loading}
        >
          Convert
        </Button>
      </div>
      {loading && (
        <div className={classes.download}>Download progress: {progress}%</div>
      )}
    </div>
  );
}

export default YoutubeToMp3Component;
