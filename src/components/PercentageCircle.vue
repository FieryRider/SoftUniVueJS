<template>
  <div class="single-chart" :style="{ top: top, left: left }">
    <svg viewBox="0 0 36 36" class="circular-chart">
      <path class="circle-bg"
        :style="{ fill: fillColor }"
        d="M18 2.0845
        a 15.9155 15.9155 0 0 1 0 31.831
        a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <path class="circle"
        :stroke-dasharray="progress"
        d="M18 2.0845
        a 15.9155 15.9155 0 0 1 0 31.831
        a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <text x="18" y="20.35" class="percentage" :style="{ fill: textColor }">{{ percentage }}%</text>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    percentage: Number,
    top: String,
    left: String,
    textColor: String,
    fillColor: String
  },
  computed: {
    progress: function() {
      return `${this.percentage}, 100`
    }
  }
}
</script>

<style scoped>
.single-chart {
  position: absolute;
  width: 33%;
}

.circular-chart {
  display: block;
  max-width: 80%;
  max-height: 250px;
}

.circle-bg {
  fill: none;
  stroke: #eee;
  stroke-width: 3.8;
}

.circle {
  fill: none;
  stroke-width: 2.8;
  stroke-linecap: round;
  animation: progress 1s ease-out forwards;
  stroke: #ff9f00;
}

@keyframes progress {
  0% {
    stroke-dasharray: 0 100;
  }
}

.percentage {
  fill: #fff;
  font-family: sans-serif;
  font-size: 0.7em;
  text-anchor: middle;
}
</style>
