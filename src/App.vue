<script setup>
import simpleCommandComponent from "@/components/simpleCommandComponent.vue"
import simpleCommandComponentWithShortcut from "@/components/simpleCommandComponentWithShortcut.vue"
import testCommand from "@/components/testCommand.vue"
</script>
<template>
    <simpleCommandComponent /> <!--Simple Command Component With No Shortcuts-->
    <simpleCommandComponentWithShortcut />  <!--Same as above but with Shortcuts for open/close dialog-->
    <testCommand /> <!--Edited so I can display the crisp data-->
</template>