<template>
        <div >
            <iframe :src="htmlAddress" class="iframe"></iframe>
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
<style>
	.iframe{
		width: 100%;
		height: 850px;
	}
</style>