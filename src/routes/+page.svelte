<script lang="ts">
    import { page } from '$app/stores'
    import { trpc } from '$lib/trpc/client'

    let greeting = 'press the button to load data'
    let loading = false

    const loadData = async () => {
        loading = true
        greeting = await trpc($page).example.palla.query()
        loading = false
    }
</script>

<h6>Loading data in<br /><code>+page.svelte</code></h6>

<a aria-busy={loading}
   href="#load"
   on:click|preventDefault={loadData}
   role="button"
>Load</a>
<p>{greeting}</p>