<script lang="ts">
  import logo from "./assets/svelte.png";
  import Counter from "./lib/Counter.svelte";
  import { db, storage } from "./firebase";
  import { afterUpdate, createEventDispatcher, onMount } from "svelte";
  import { collectionData } from "rxfire/firestore";
  import { startWith } from "rxjs/operators";

  let videos = [];
  let currentVideo = null;
  let currentVideoIndex = 0;
  let url;
  let selectedLabel;
  let selections = {};
  let refId;
  const labels = [
    "neutral",
    "happy",
    "surprised",
    "angry",
    "sad",
    "fear",
    "disgust",
  ];
  onMount(async () => {
    const query = db.collection("videos");
    collectionData(query, "id")
      .pipe(startWith([]))
      .subscribe((vs) => {
        videos = vs;
        currentVideo = vs[0];
        getVideoUrl();
      });
    const docRef = db.collection("selections").doc();
    refId = docRef.id;
    const res = await docRef.set({
      id: docRef.id,
      selections,
    });
  });

  afterUpdate(async () => {
    console.log(selections);
  });

  function updateCurrentVideo() {
    currentVideo = videos[currentVideoIndex];
    selectedLabel = selections[currentVideo.name];
    getVideoUrl();
  }

  function updateSelections() {
    db.collection("selections")
      .doc(refId)
      .update({
        selections,
      });
  }

  async function getVideoUrl() {
    if (currentVideo == null) {
      return undefined;
    }
    const name = currentVideo.name;

    const ref = storage.ref(name);
    url = await ref.getDownloadURL();
  }

  function select(label: string) {
    selectedLabel = label;
    if (!!currentVideo) selections[currentVideo.name] = label;
    updateSelections();
  }

  function nextVideo(increment: number) {
    currentVideoIndex += increment;
    if (currentVideoIndex >= videos.length) {
      currentVideoIndex = 0;
      updateCurrentVideo();
      return;
    }
    if (currentVideoIndex < 0) {
      currentVideoIndex = videos.length - 1;
      updateCurrentVideo();
      return;
    }
    console.log("here");
    updateCurrentVideo();
  }

  function play() {
    console.log("HI!");
  }

  // console.log(videos);

  const dispatch = createEventDispatcher();
</script>

<main>
  <div class="container">
    <video muted loop src={url} alt="src" autoplay>loading...</video>
    <div class="controls">
      <div class="label-row">
        {#each labels as label}
          <button
            class={label === selectedLabel
              ? "label-button-selected"
              : "label-button"}
            on:click={() => select(label)}>{label}</button
          >
        {/each}
      </div>
      <div class="button-row">
        <button on:click={() => nextVideo(-1)} class="control-button">
          {"<"}
        </button>
        <button on:click={play} class="play-button"> Play </button>
        <button on:click={() => nextVideo(1)} class="control-button">
          {">"}
        </button>
      </div>
    </div>
  </div>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  }

  .button-row {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
  }

  .controls {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .label-row {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    flex-direction: column;
  }

  .control-button {
    font-family: inherit;
    font-size: inherit;
    padding: 1em 2em;
    color: #ff3e00;
    background-color: rgba(255, 62, 0, 0.1);
    border-radius: 2em;
    border: 2px solid rgba(255, 62, 0, 0);
    outline: none;
    width: 20px;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
  }

  .label-button {
    font-family: inherit;
    font-size: inherit;
    padding: 1em 2em;
    color: #ff3e00;
    background-color: rgba(255, 62, 0, 0.1);
    border-radius: 2em;
    border: 2px solid rgba(255, 62, 0, 0);
    outline: none;
    width: 150px;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
    margin: 4px;
  }

  .label-button-selected {
    font-family: inherit;
    font-size: inherit;
    padding: 1em 2em;
    color: #3d1001;
    background-color: rgba(255, 62, 0, 0.1);
    border-radius: 2em;
    border: 2px solid rgba(255, 62, 0, 0);
    outline: none;
    width: 150px;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
    margin: 4px;
  }

  .play-button {
    font-family: inherit;
    font-size: inherit;
    padding: 1em 2em;
    color: #ff3e00;
    background-color: rgba(255, 62, 0, 0.1);
    border-radius: 2em;
    border: 2px solid rgba(255, 62, 0, 0);
    outline: none;
    width: 200px;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
  }

  video {
    max-height: 480px;
    width: 720px;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  img {
    height: 16rem;
    width: 16rem;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
  }

  p {
    max-width: 14rem;
    margin: 1rem auto;
    line-height: 1.35;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }
</style>
