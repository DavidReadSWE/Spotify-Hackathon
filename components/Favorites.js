import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Song from "./Song";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      };
      fetch("https://api.spotify.com/v1/me/tracks?limit=50", options)
        .then((response) => response.json())
        .then((response) => setFavorites(response.items))
        .catch((err) => console.error(err));
    }
  }, [session]);
  console.log("FAV COMPONENT", favorites);

  return (
    <div className="px-8 flex flex-col space-y-1 pb-28 text-white">
      {favorites?.map((favorite, i) => (
        <Song key={favorite.track.id} track={favorite} order={i} />
      ))}
    </div>
  );
}
