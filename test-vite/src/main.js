import { createApp } from 'vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import store from './store'
import * as ELIcons from '@element-plus/icons-vue'
import storage from './utils/storage'

const app = createApp(App)

app.directive("has",{
	beforeMount:(el,binding)=>{
		
		let actionList = storage.getItem("actionList")
		let value = binding.value
		let hasPermission = actionList.includes(value)
		if(!hasPermission){
			el.style="display:none"
			setTimeout(()=>{
				el.parentNode.removeChild(el)
			},0)
		}
	}
})
for (let iconName in ELIcons) {
	app.component(iconName, ELIcons[iconName])
}

app.use(router).use(store).use(ElementPlus).mount('#app')
 