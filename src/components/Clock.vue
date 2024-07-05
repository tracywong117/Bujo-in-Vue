<template>
    <div id="bujoClock"></div>
    <div id="popover"
        :style="{ display: popoverVisible ? 'block' : 'none', position: 'absolute', padding: '10px', background: 'white', border: '1px solid #ccc', left: popoverX + 'px', top: popoverY + 'px' }">
        <div>Select an activity:</div>
        <button class="activity-btn" v-for="activity in activities" :key="activity.color" :data-color="activity.color"
            @click="changeColor(activity.color)">{{ activity.name }}</button>
        <button @click="closePopover">Close</button>
    </div>
</template>

<script>
import * as d3 from 'd3';
import { useSettingStore } from '../stores/setting.js';
import { toRefs } from 'vue';

export default {
    data() {
        return {
            popoverVisible: false,
            popoverX: 0,
            popoverY: 0,
            currentPath: null
        };
    }, setup() {
        const settingStore = useSettingStore();
        const settingState = toRefs(settingStore);
        return {
            ...settingState,
        };
    },
    mounted() {
        this.createbujoClock();
    },
    methods: {
        createbujoClock() {
            const width = 500;
            const height = 500;
            const radius = Math.min(width, height) / 2 - 50; // Reduce radius for text clearance
            // const colorInput = document.getElementById('colorInput');

            const svg = d3.select('#bujoClock').append('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', `translate(${width / 2}, ${height / 2})`);

            const colors = [
                '#f4a1c0', '#8cd3dd', '#a4c8f0', '#fef4b1', '#e3aef2', '#9bd3c3',
                '#fae4d9', '#cfe7f3', '#dee9f7', '#fff6d3', '#f3d1f4', '#b0e0e6'
            ];

            const arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius)
                .startAngle((d, i) => i * Math.PI / 6)
                .endAngle((d, i) => (i + 1) * Math.PI / 6);

            svg.selectAll('path.sector')
                .data(colors)
                .enter()
                .append('path')
                .attr('class', 'sector')
                .attr('d', arc)
                .attr('fill', d => d);

            // Add clock numbers
            const textRadius = radius + 20; // Position text outside the sectors
            svg.selectAll('text.clock-time')
                .data(d3.range(1, 13)) // Create an array from 1 to 12
                .enter()
                .append('text')
                .attr('class', 'clock-time')
                .attr('x', (d) => Math.cos((d - 3) * Math.PI / 6) * textRadius) // Adjust positioning
                .attr('y', (d) => Math.sin((d - 3) * Math.PI / 6) * textRadius)
                .attr('dy', '0.35em') // Center text vertically
                .attr('text-anchor', 'middle') // Ensure text is centered on calculated point
                .text(d => d);

            // Add event handlers
            // svg.selectAll('path.sector')
            //     .on('click', function (event, d) {
            //         const currentPath = this;
            //         colorInput.value = colors[d - 1];
            //         colorInput.click();
            //         colorInput.onchange = () => {
            //             d3.select(currentPath).attr('fill', colorInput.value);
            //         };
            //     });

            // svg.selectAll('path.sector')
            //     .on('click', function (event, d) {
            //         const currentPath = this;
            //         const popover = document.getElementById('popover');
            //         popover.style.display = 'block';
            //         popover.style.left = event.pageX + 'px';
            //         popover.style.top = event.pageY + 'px';

            //         const buttons = document.querySelectorAll('.activity-btn');
            //         buttons.forEach(button => {
            //             button.onclick = () => {
            //                 const selectedColor = button.getAttribute('data-color');
            //                 d3.select(currentPath).attr('fill', selectedColor);
            //                 closePopover();
            //             };
            //         });
            //     });

            // function closePopover() {
            //     document.getElementById('popover').style.display = 'none';
            // }

            svg.selectAll('path.sector')
                .on('click', (event, d) => this.showPopover(event, d));

            // function closePopover() {
            //     document.getElementById('popover').style.display = 'none';
            // }

            // Adding borders
            svg.selectAll('path.border')
                .data(colors)
                .enter()
                .append('path')
                .attr('class', 'border')
                .attr('d', function (d, i) {
                    const startAngle = i * Math.PI / 6;
                    const endAngle = (i + 1) * Math.PI / 6;
                    const startOuter = d3.pointRadial(startAngle, radius);
                    const endOuter = d3.pointRadial(endAngle, radius);
                    // Arc path
                    return `M${startOuter} A${radius},${radius} 0 0,1 ${endOuter} L0,0`;
                })
                .attr('fill', 'none')
                .attr('stroke', 'rgb(172, 188, 211)')
                .attr('stroke-width', '2px');

            // Additional stroke to cover radial lines
            svg.selectAll('line')
                .data(colors)
                .enter()
                .append('line')
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', (d, i) => Math.cos((i + 1) * Math.PI / 6) * radius)
                .attr('y2', (d, i) => Math.sin((i + 1) * Math.PI / 6) * radius)
                .attr('stroke', 'rgb(172, 188, 211)')
                .attr('stroke-width', '2px');
        },
        showPopover(event, d) {
            this.popoverVisible = true;
            this.popoverX = event.pageX;
            this.popoverY = event.pageY;
            this.currentPath = event.currentTarget;
        },
        changeColor(color) {
            d3.select(this.currentPath).attr('fill', color);
            this.closePopover();
        },
        closePopover() {
            this.popoverVisible = false;
        }
    },
}
</script>