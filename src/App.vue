<template>
  <div class="">
    <div id="content-container" class="block">
      <div id="navbar-container" class="block">
        <Nav/>
      </div>
    </div>
    <div id="sidebar-container" class="max-h-screen flex-none fixed block inset-y-0 right-0 z-10 w-60">
      <Sidebar/>
    </div>
  </div>

<!--  <DrawArea/>-->
</template>

<script lang="ts">

import { defineComponent } from 'vue'

import DrawArea from "./components/DrawArea/DrawArea.vue";
import Sidebar from "./components/Sidebar/Sidebar.vue"
import Nav from "./components/Sidebar/Nav.vue"

export default defineComponent({
  name: 'App',
  components: {
    Nav,
    Sidebar,
    DrawArea,
  }
})
</script>


<style>
:root {
  --menubar-height: 45pt;
  --sidebar-width: 250pt;
}

#content-container {
  width: calc(100% - var(--sidebar-width));
}

#navbar-container {

}

#sidebar-container {
  width: var(--sidebar-width);
}
</style>