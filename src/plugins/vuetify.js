import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
// import '@fortawesome/fontawesome-free/css/all.css' // Ensure your project is capable of handling css files
import { mdi } from 'vuetify/iconsets/mdi'
// import { aliases, fa } from 'vuetify/iconsets/fa'
import { createVuetify } from 'vuetify'
import colors from 'vuetify/lib/util/colors'

const colorArray = colors
// Translations provided by Vuetify
import { zhHans } from 'vuetify/locale'
const vuetify = createVuetify({
    // 在这里添加你的 Vuetify 配置选项
    locale: {
        locale: 'zhHans',
        messages: { zhHans },
    },
    theme: {
        defaultTheme: 'dark',
        themes: {
            customLight: {
                dark: false,
                colors: {
                    surface: colorArray.brown.darken1,
                    primary: colorArray.brown.base,
                }
            }
        }
    },
    icons: {
        defaultSet: 'mdi', // This is already the default value - only for display purposes
        // aliases,
        sets: {
            // fa,
            mdi,
        },
    },
})


//   <v-icon icon="fas fa-plus" /> // This renders a FontAwesome icon
//   <v-icon icon="mdi:mdi-minus" /> // This renders a MDI icon

export default vuetify