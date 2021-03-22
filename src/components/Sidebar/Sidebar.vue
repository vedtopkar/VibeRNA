<template>
    <!--  Sidebar -->
    <aside class="overflow-hidden bg-white border-l h-full">
        <!-- Sidebar header tabs-->
        <div
            class="flex mb-0 space-x-0 p-0 h-12 w-auto text-center justify-center items-center"
        >
            <div class="sidebar-tab">Setup</div>
            <div class="sidebar-tab">Style</div>
            <div class="sidebar-tab">Annotate</div>
        </div>

        <!--   Sidebar links   -->
        <div>
            <nav class="overflow-hidden">
                <ul class="p-2 overflow-hidden">
                    <li>
                        <a
                            class="p-2 overflow-hidden rounded-md hover:bg-gray-100"
                            href="#"
                            ><span>Item 1</span></a
                        >
                    </li>
                    <li>
                        <a
                            class="p-2 overflow-hidden rounded-md hover:bg-gray-100"
                            href="#"
                            ><span>Item 2</span></a
                        >
                    </li>
                </ul>
            </nav>
        </div>
    </aside>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
export default defineComponent({
    name: 'Sidebar',
    props: {}
})
</script>

<style>
.sidebar-tab {
    @apply flex-1 justify-center items-center h-12;
    @apply border-2;
    @apply hover:bg-gray-100;
}
</style>
