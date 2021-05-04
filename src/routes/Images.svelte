<script lang="ts">
  import { db, storage } from "../firebase";
  import { afterUpdate, createEventDispatcher, onMount } from "svelte";
  import { collectionData } from "rxfire/firestore";
  import { getDownloadURL } from "rxfire/storage";
  import { startWith } from "rxjs/operators";
  import { Observable, Subscription } from "rxjs";
  import type { FirebaseImage, FirebaseVideo } from "../firebase-types";
  import Selector from "../lib/Selector.svelte";
import { batch, selectionId } from "../store";
import {page} from "../store";

  let images: FirebaseImage[] = [];
  let currentImage: FirebaseImage = null;
  let currentImageIndex = 0;
  let url: string;
  let selectedLabel: string;
  let selections = {};
  let refId: string;
  let urlSub: Subscription;
  const labels = [
    "neutral",
    "happy",
    "surprised",
    "angry",
    "sad",
    "fear",
    "disgust",
  ];
  const unsubscribe = selectionId.subscribe(async id => {
    refId = id;
    // selections = await db.collection("selections").doc(refId).get();
  });
  onMount(async () => {
    const unsubscribe = batch.subscribe(batch => {
      images = batch.images;
      currentImage = batch.images[0];
      getVideoUrl();
    })
  });

  function updateCurrentImage() {
    currentImage = images[currentImageIndex];
    selectedLabel = selections[currentImage.name];
    getVideoUrl();
  }

  function updateSelections() {
    db.collection("selections")
      .doc(refId)
      .update({
        imageSelections: selections,
      });
  }

  async function getVideoUrl() {
    if (currentImage == null) {
      return undefined;
    }
    const name = 'img/' + currentImage.name;

    const ref = storage.ref(name);
    if (!!urlSub) urlSub.unsubscribe();
    urlSub = getDownloadURL(ref).subscribe((u) => {
      url = u;
    });
    // url = await ref.getDownloadURL();
  }

  function select(label: string) {
    selectedLabel = label;
    if (!!currentImage) selections[currentImage.name] = label;
    updateSelections();
  }

  function nextImage(increment: number) {
    currentImageIndex += increment;
    if (currentImageIndex >= images.length) {
      currentImageIndex = 0;
      updateCurrentImage();
      return;
    }
    if (currentImageIndex < 0) {
      currentImageIndex = images.length - 1;
      updateCurrentImage();
      return;
    }
    updateCurrentImage();
  }

  function continueToImages() {
    page.set('videos');
  }

  function activeButton(): string {
    return "bg-yellow-700 text-yellow-100 text-base font-semibold px-6 py-2 rounded-lg hover:shadow-lg w-full"; 
  }
  function inactiveButton(): string {
    return "bg-yellow-100 text-yellow-700 text-base font-semibold px-6 py-2 rounded-lg hover:shadow-lg w-full";
  }

  function handleKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (key === 'd' || key === 'j') {
      nextImage(-1);
      return;
    }
    if (key === 'f' || key === 'k') {
      nextImage(1);
      return;
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="flex flex-col justify-center items-center">
  <div class="container space-y-2">
    <img src={url} alt="src" />
    <div class="controls">
      <div class="label-row space-y-2">
        {#each labels as label}
          <button
            class={label === selectedLabel ? activeButton() : inactiveButton()}
            on:click={() => select(label)}>{label}</button
          >
        {/each}
      </div>
      <div class="button-row space-x-1">
        <button on:click={() => nextImage(-1)} class={inactiveButton()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clip="evenodd"
            />
          </svg>
        </button>
        <!-- <button on:click={() => {}} class={inactiveButton()}> Play </button> -->
        <button on:click={() => nextImage(1)} class={inactiveButton()}>
          <!-- {">"} -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clip="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
  <!-- {#each labels as label}
    <Selector
      on:selection={(event) => select(event.detail.label)}
      {label}
      selected={label === selectedLabel}
    />
  {/each} -->
  <p class="font-normal text-center text-lg">
    You currently are at image <b class="text-indigo-600"
      >{currentImageIndex + 1}</b
    >
    of <b class="text-indigo-700">{images.length}</b>
    Once you are done with labelling the images, switch to the videos! Keep in mind
    that you <b> cannot </b> return to the images!
  </p>
  <button
    on:click={continueToImages}
    class="bg-red-500 text-red-200 text-base font-semibold px-6 py-2 rounded-lg hover:shadow-lg"
  >
    Continue to Videos!
  </button>
</div>

<style global lang="postcss">
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  @tailwind base;
  @tailwind components;
  @tailwind utilities;

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
    align-items: space-around;
    justify-content: space-around;
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

  /* button:active {
    background-color: rgba(255, 62, 0, 0.2);
  }

  button:hover {
    border: 2px solid #ff3e00;
  } */

  img {
    max-height: 480px;
    width: 720px;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  /* img {
    height: 16rem;
    width: 16rem;
  } */

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
