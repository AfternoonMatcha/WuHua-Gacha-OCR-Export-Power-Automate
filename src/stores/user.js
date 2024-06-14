import { ref } from "vue";
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
    const token = ref(
        window.localStorage.getItem('token') ||
        '')

    const saveToken = (str) => {
        token.value = str
        window.localStorage.setItem('token', str === null ? '' : str)
    }

    const profile = ref(null)

    const saveProfile = (obj) => {
        profile.value = obj
    }

    return { token, saveToken, profile, saveProfile }
});