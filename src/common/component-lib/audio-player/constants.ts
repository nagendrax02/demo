export enum AudioReadyState {
  HaveNothing = 0, // No information about the audio is available.
  HaveMetadata = 1, // Metadata for the audio (e.g., duration) is available.
  HaveCurrentData = 2, // Data for the current playback position is available.
  HaveFutureData = 3, // Data for the current and at least the next playback position is available.
  HaveEnoughData = 4 // Enough data is available to start and continue playback.
}

export enum AudioNetworkState {
  Empty = 0, // The element has not yet been initialized.
  Idle = 1, // The element is active but has not yet downloaded anything.
  Loading = 2, // The element is downloading data.
  NoSource = 3 // No source is found or available.
}
