import { defineStore } from 'pinia';

export const useSettingStore = defineStore('settingStore', {
    state: () => ({
        activities: [
            { name: 'Leisure Time', color: '#f4a1c0' },
            { name: 'Lunch', color: '#fef4b1' },
            { name: 'Work', color: '#a4c8f0' }
        ],
    }),
    actions: {
        addActivity(name, color) {
            this.activities.push({ name, color });
        },
        removeActivity(index) {
            this.activities.splice(index, 1);
        }
    }
});  