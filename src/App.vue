<script setup>
import simpleCommandComponent from "@/components/simpleCommandComponent.vue"
import simpleCommandComponentWithShortcut from "@/components/simpleCommandComponentWithShortcut.vue"
import testCommand from "@/components/testCommand.vue"
</script>
<template>
<!--    <simpleCommandComponent /> &lt;!&ndash;Simple Command Component With No Shortcuts&ndash;&gt;-->
<!--    <simpleCommandComponentWithShortcut />  &lt;!&ndash;Same as above but with Shortcuts for open/close dialog&ndash;&gt;-->
    <testCommand /> <!--Edited so I can display the crisp data-->
</template>

<style>
html, body {
  background: transparent;
}
</style>