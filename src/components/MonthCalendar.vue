<template>
    <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; padding-bottom: 20px; border: 1px solid #c1b5ce;
    border-radius: 5px; width: 400px; ">
        <div style="display: flex; justify-content: space-between; width: 90%; align-items: center;">
            <el-button plain color="rgb(139, 92, 246)" @click="prevMonth"
                style="height: 10px; padding: 8px 4px; margin: 0 50px;">
                <SvgIcon type="mdi" :path="mdiChevronLeft_path" width="10" height="10"></SvgIcon>
            </el-button>
            <p style="text-align: center; background: var(--lin-grad-primary-1); -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;">{{ month }} {{ year }}</p>
            <el-button plain color="rgb(189, 101, 166)" @click="nextMonth"
                style="height: 10px; padding: 8px 4px; margin: 0 50px;">
                <SvgIcon type="mdi" :path="mdiChevronRight_path" width="10" height="10"></SvgIcon>
            </el-button>
        </div>
        <table class="monthlyCalendarSmall">
            <thead>
                <tr>
                    <th v-for="day in daysOfWeek" style="color: var(--primary-font-color-1); font-size: 14px;">{{ day }}
                    </th>
                </tr>
            </thead>
            <tbody style="vertical-align: baseline;">
                <tr v-for="(week, index) in calendarData">
                    <td v-for="dayObj in week">
                        <div>
                            <span class="calendar-day-select"
                                :class="{ 'current-day': isDateCurrentSelected(Object.keys(dayObj)[0]), 'not-current-month': isNotMonthBrowsing(Object.keys(dayObj)[0]) }"
                                @click="handleSelectDate(Object.keys(dayObj)[0])">{{
                Object.values(dayObj)[0] }}</span><br>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { ElButton } from 'element-plus';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';

export default {
    components: {
        ElButton,
        SvgIcon
    },
    props: {
        month: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            monthBrowsing: '',
            currentSelected: '',
            mdiChevronLeft_path: mdiChevronLeft,
            mdiChevronRight_path: mdiChevronRight,
        };
    },
    mounted() {
        this.monthBrowsing = this.month;
    },
    computed: {
        year() {
            return new Date(this.monthBrowsing).getFullYear();
        },
        month() {
            const options = { month: 'long' };
            return new Date(this.monthBrowsing).toLocaleString('en-US', options);
        },
        daysOfWeek() {
            return ["S", "M", "T", "W", "T", "F", "S"];
        },
        calendarData() {
            const date = new Date(this.monthBrowsing);
            const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const startDate = new Date(firstDay);
            startDate.setDate(firstDay.getDate() - firstDay.getDay());

            const endDate = new Date(lastDay);
            endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

            const calendarData = [];
            let date_temp = new Date(startDate);

            var temp = {};

            while (date_temp <= endDate) {
                const week = [];
                for (let i = 0; i < 7; i++) {
                    var dateObj = date_temp;
                    var day_of_month = date_temp.getDate();
                    temp = {};
                    temp[dateObj] = day_of_month;
                    week.push(temp);
                    date_temp.setDate(date_temp.getDate() + 1);
                }
                calendarData.push(week);
            }
            // console.log(calendarData);

            return calendarData;
        }
    },
    methods: {
        isDateCurrentSelected(day) {
            if (this.currentSelected != '') {
                const currentDay = new Date(this.currentSelected).getDate();
                const selectedDay = new Date(day).getDate();
                const currentMonth = new Date(this.currentSelected).getMonth();
                const selectedMonth = new Date(day).getMonth();
                return currentDay == selectedDay && currentMonth == selectedMonth;
            }
        },
        isNotMonthBrowsing(day) {
            const inputMonth = new Date(this.monthBrowsing).getMonth();
            const selectedMonth = new Date(day).getMonth();
            return inputMonth != selectedMonth;
        },
        handleSelectDate(date) {
            // console.log(date);
            const offset = new Date(date).getTimezoneOffset();
            const tempdate = new Date(new Date(date).getTime() - (offset * 60 * 1000));
            const formattedDate = tempdate.toISOString().split('T')[0];
            this.currentSelected = formattedDate;

            this.$emit('update:month', this.currentSelected);
        },
        prevMonth() {
            const currentDate = new Date(this.monthBrowsing);
            const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
            this.monthBrowsing = prevMonthDate;
            console.log(this.monthBrowsing);
        },
        nextMonth() {
            const currentDate = new Date(this.monthBrowsing);
            const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
            this.monthBrowsing = nextMonthDate;
            console.log(this.monthBrowsing);
        },
    }
};
</script>

<style>
.monthlyCalendarSmall {
    font-size: 10px;
    width: 90%;
    border-collapse: collapse;
    color: var(--primary-font-color-2);

}

.monthlyCalendarSmall th,
.monthlyCalendarSmall td {
    text-align: center;
    padding: 2px;
    width: 14.285%;
}

.current-day {
    background-color: var(--primary-light-sharp-color-2);
    color: #fff;
    border-radius: 100%;
    display: inline-block;
}

.not-current-month {
    /* background-color: aqua; */
    color: var(--primary-pale-color-1);
}

.calendar-day-select {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 100%;
    text-align: center;
    line-height: 20px;
    font-size: 14px;
}

.calendar-day-select:hover {
    cursor: pointer;
    background-color: var(--primary-light-color-1);
}

.current-day:hover {
    background-color: var(--primary-light-sharp-color-1);

}

.current-day:hover .calendar-day-select {
    background-color: var(--primary-light-sharp-color-1);

}
</style>