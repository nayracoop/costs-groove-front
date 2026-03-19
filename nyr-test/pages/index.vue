<script setup>
import {definePageMeta, navigateTo} from "#imports";

defineOptions({name: "IndexRedirectPage"});
definePageMeta({layout: "admin"});

await navigateTo("/esquemas", {replace: true});
</script>
