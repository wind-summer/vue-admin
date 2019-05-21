<template>
        <div >
            <iframe :src="htmlAddress" height="800px" width="100%"></iframe>
        </div>
</template>

<script>
	import { ipAddress } from '../../api/api';

	export default {
		data() {
			return {
                htmlAddress : ipAddress+'/swagger-ui.html'
            }
		},
		methods: {
            
		},
		mounted() {
		}
	}
</script>