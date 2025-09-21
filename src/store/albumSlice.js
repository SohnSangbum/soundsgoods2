import { create } from "zustand";

const getLocalPlaylists = () =>
  JSON.parse(localStorage.getItem("playlists")) || [];

const getLocalSelected = () =>
  JSON.parse(localStorage.getItem("selectedPlaylist")) || null;

const getLocalSelectedItem = () =>
  JSON.parse(localStorage.getItem("selectedItem")) || null;

export const usePlaylistStore = create((set, get) => ({
  playlists: getLocalPlaylists(),
  selectedPlaylist: getLocalSelected(),
  selectedItem: getLocalSelectedItem(),

  addPlaylist: (name) => {
    if (!name.trim()) return;
    const newId = get().playlists.length
      ? get().playlists[get().playlists.length - 1].id + 1
      : 1;
    const newPlaylists = [...get().playlists, { id: newId, name, songs: [] }];
    localStorage.setItem("playlists", JSON.stringify(newPlaylists));
    set({ playlists: newPlaylists });
  },

  deletePlaylist: (id) => {
    const newPlaylists = get().playlists.filter((p) => p.id !== id);
    localStorage.setItem("playlists", JSON.stringify(newPlaylists));
    set({ playlists: newPlaylists });
    if (get().selectedPlaylist?.id === id) get().deselectPlaylist();
  },

  selectPlaylist: (playlist) => {
    localStorage.setItem("selectedPlaylist", JSON.stringify(playlist));
    set({ selectedPlaylist: playlist });
  },

  deselectPlaylist: () => {
    localStorage.removeItem("selectedPlaylist");
    set({ selectedPlaylist: null });
  },

  clearAll: () => {
    localStorage.removeItem("playlists");
    localStorage.removeItem("selectedPlaylist");
    localStorage.removeItem("selectedItem");
    set({ playlists: [], selectedPlaylist: null, selectedItem: null });
  },

  selectItem: (item) => {
    localStorage.setItem("selectedItem", JSON.stringify(item));
    set({ selectedItem: item });
  },

  addSongToPlaylist: (playlistId, song) => {
    const playlists = get().playlists.map((p) =>
      p.id === playlistId ? { ...p, songs: [...p.songs, song] } : p
    );
    localStorage.setItem("playlists", JSON.stringify(playlists));
    set({ playlists });
  },
}));
