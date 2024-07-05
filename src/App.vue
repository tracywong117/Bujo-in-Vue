<script setup>
import Clock from './components/Clock.vue'
import MonthCalendar from './components/MonthCalendar.vue'
</script>

<template>
  <div id="app">
    <Clock />
    <month-calendar month="2024-07-01" />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
@import './assets/color.css';

body {
  /* background-color: var(--paper-background); */
  font-family: Poppins, Playfair, Switzer, Inter, DM Sans, Mona Sans, Arial, sans-serif;
  font-size: 22px;
  overflow-x: hidden;
}

</style>
