<template>
  <div :style="{ padding: '0 0 32px 32px' }">
    <h4 :style="{ marginBottom: '20px' }">{{ title }}</h4>
    <v-chart
      height="254"
      :data="data"
      :forceFit="true"
      :padding="['auto', 'auto', '40', '50']">
      <v-tooltip/>
      <v-axis/>
      <v-bar position="x*y"/>
    </v-chart>
  </div>
</template>

<script>
const data = [
  {
    x: 'surface3',
    y: 10
  },
  {
    x: 'surface Pro5',
    y: 5
  },
  {
    x: 'surface laptop',
    y: 3
  },
  {
    x: 'surface3 cover ',
    y: 0
  },
  {
    x: 'surfacePro4 cover',
    y: 1
  },
  {
    x: 'surface3 power',
    y: 4
  },
  {
    x: 'surfacePro4 power',
    y: 12
  }

]
// for (let i = 0; i < 12; i += 1) {
//   data.push({
//     x: `${i + 1}月`,
//     y: Math.floor(Math.random() * 1000) + 200
//   })
// }
const tooltip = [
  'x*y',
  (x, y) => ({
    name: x,
    value: y + '台'
  })
]
const scale = [{
  dataKey: 'x',
  min: 2
}, {
  dataKey: 'y',
  title: '时间',
  min: 1,
  max: 22
}]

export default {
  name: 'Bar',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      data,
      scale,
      tooltip
    }
  }
}
</script>
