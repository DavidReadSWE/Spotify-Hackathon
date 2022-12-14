/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from "react";
import useSpotify from "../hooks/useSpotify";
import { useSession } from "next-auth/react";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import { useRecoilState } from "recoil";
import useSongInfo from "../hooks/useSongInfo";
import {
  SwitchHorizontalIcon,
  VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";
import {
  RewindIcon,
  PlayIcon,
  FastForwardIcon,
  ReplyIcon,
  PauseIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import debounce from "lodash/debounce";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();
  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now playing", data.body?.item);
        setCurrentTrackId(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedAdjustVolume = useCallback(
    debounce((volume) => spotifyApi.setVolume(volume).catch((err) => {}), 500),
    []
  );

  //   useEffect(() => {
  //     if (spotifyApi.getAccessToken() && !currentTrackId) {
  //       fetchCurrentSong();
  //       setVolume(50);
  //     }
  //   }, [currentTrackId, spotifyApi, session]);

  //   const debouncedAdjustVolume = useCallback(
  //     debounce((volume) => spotifyApi.setVolume(volume).catch((err) => {}), 500),
  //     []
  //   );

  //   useEffect(() => {
  //     if (volume > 0 && volume < 100) {
  //       debouncedAdjustVolume(volume);
  //     }
  //   }, [volume]);

  const handleSkipToNext = () => {
    const options = {
      method: "POST",
      headers: {
        Authorization:
          "Bearer BQAtNZCE-mmUEK_r13Y0z0QJPd8vmy8_jVdbtjxJeLmSqEf9ZYhuUlg11ZGKtFXuV_GdABotl7_MbZu-mA_iBBC_uGbBgfLwSwgR1xUcltAREYKAh0tBV8Ges3YL4Vd7TVHT1OdAOGTg8aP2O2IUv8J6IPTZzO-8f_Wbkv9Xhj9dEE0j2aG3txlCP5XhlU0V76SZ1xTLXIPkblJxcNhDXWahAvI7wo81N8jsHNSJxMYvn-B0",
      },
    };

    fetch("https://api.spotify.com/v1/me/player/next", options)
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  };

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      {/* Center */}
      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon
          className="button"
          onClick={() => spotifyApi.skipToPrevious()}
        />

        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
        )}

        <FastForwardIcon
          className="button"
          onClick={handleSkipToNext}
        />
        <ReplyIcon className="button" />
      </div>

      {/* Right */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          min={0}
          max={100}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <VolumeUpIcon
          className="button"
          onClick={() => volume < 100 && setVolume(volume + 10)}
        />
      </div>
    </div>
  );
}

export default Player;
