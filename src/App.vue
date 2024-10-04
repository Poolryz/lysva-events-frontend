<template>
	<div>
		<HeaderComponent />
		<router-view></router-view>
	</div>
</template>

<script>
	import HeaderComponent from "./components/HeaderComponent.vue";
	export default {
		name: "App",
		components: {
			HeaderComponent,
		},
	};
</script>

<style>
	nav {
		padding: 10px;
	}
</style>
