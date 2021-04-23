<script lang="ts">
  import { db, storage } from "./firebase";
  import { afterUpdate, createEventDispatcher, onMount, setContext } from "svelte";
  import { collectionData } from "rxfire/firestore";
  import { getDownloadURL } from "rxfire/storage";
  import { startWith } from "rxjs/operators";
  import { Observable, Subscription } from "rxjs";
  import type { FirebaseVideo } from "./firebase-types";
  import Selector from "./lib/Selector.svelte";
  import {Router, Link, Route} from "svelte-routing";
  import Images from './routes/Images.svelte';
  import Videos from './routes/Videos.svelte';
  import Landing from "./routes/Landing.svelte";
import { page, selectionId } from "./store";

  export let url = '';
  onMount(async () => {
    const docRef = db.collection("selections").doc();
    let refId = docRef.id;
    const res = await docRef.set({
      id: docRef.id,
      selections: {},
      createdAt: new Date().getTime(),
    });
    selectionId.set(refId);

  });
  let current_page = 'landing';
  const unsubscribe = page.subscribe(pg => {
    current_page = pg;
  })
</script>

<main>
  <div class="flex flex-col justify-center items-center">
    {#if current_page === "landing"}
      <Landing />
    {:else if current_page === "videos"}
      <Videos />
    {:else if current_page === "images"}
      <Images />
    {:else}
      <Videos />
    {/if}
  </div>
</main>

<!-- <Router {url}>
  <nav>
    <Link to="/">Landing</Link>
    <Link to="videos">Videos</Link>
    <Link to="images">Images</Link>
  </nav>
  <div>
    <Route path="videos" component={Videos} />
    <Route path="images" component={Images} />
    <Route path="/"><Landing /></Route>
  </div>
</Router> -->
<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
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

  /* button:active {
    background-color: rgba(255, 62, 0, 0.2);
  }

  button:hover {
    border: 2px solid #ff3e00;
  } */

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
