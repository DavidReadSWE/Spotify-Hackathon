import React, { useState, useEffect } from "react";
import useSpotify from "../hooks/useSpotify";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import { useRecoilState } from "recoil";

function useSongInfo() {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentTrackId) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentTrackId}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        ).then((response) => response.json());

        setSongInfo(trackInfo);
      }
    };
    fetchSongInfo();
  }, [currentTrackId, spotifyApi]);

  return songInfo;
}

export default useSongInfo;