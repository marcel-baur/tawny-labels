<script lang="ts">
  import { page } from "../store";

  import { navigate } from "svelte-routing";
  function onGo() {
    page.set("images");
  }
</script>

<div class="flex justify-center items-center flex-col">
  <img src="tawny_orange.png" alt="TAWNY" class="w:full p-2 m-4" />
  <p class="font-normal text-center text-lg">
    Welcome to the RAVDESS Human Labeling Tool!
    <br />
    You will be confronted with videos and still images. Please label them based
    on the emotion you think they convey. Don't overthink your selection, just pick
    the one that seems to initially fit the best.
    <br />
    <b class="text-yellow-700">
      Please do not refresh your browser window while participating
    </b>, you will not be able to continue from your last save later on!
    <br />
    Click on the button below to start! Once you are done with the images, click
    on the "Continue" Button on that page to start with the videos.
  </p>
  <button
    type="button"
    class="bg-yellow-100 text-yellow-700 text-base font-semibold px-6 py-2 rounded-lg"
    on:click={onGo}
  >
    Let's go!
  </button>
</div>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
</style>
