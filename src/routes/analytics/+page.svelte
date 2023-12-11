<script>
	import { assignments } from '../../store/assignments.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import AnalysticsTables from './AnalysticsTables.svelte';
	import ExternalValidation from './ExternalValidation.svelte';

	let assignment_names = [];
	let selected_assignment = '';
	let show_external_validation = false;

	onMount(async () => {
		if ($assignments.length == 0) {
			goto('/');
		} else {
			assignment_names = $assignments.map((assignment) => assignment.name);
			selected_assignment = assignment_names[0];
		}
	});

	const selectAssignment = (assignment_name) => {
		selected_assignment = assignment_name;
	};
</script>

<div class="analystics-wrap flex">
	<nav class="assignment-nav">
		<ul>
			{#each assignment_names as assignment_name}
				<li
					class="assignment-link"
					class:assignment-selected={!show_external_validation &&
						assignment_name === selected_assignment}
				>
					<a
						on:click={() => {
							show_external_validation = false;
							selectAssignment(assignment_name);
						}}
					>
						<span class="flex-auto">{assignment_name}</span>
					</a>
				</li>
			{/each}
			<li class="assignment-link" class:assignment-selected={show_external_validation}>
				<a
					on:click={() => {
						show_external_validation = true;
					}}
				>
					<span class="flex-auto">External Validation</span>
				</a>
			</li>
		</ul>
	</nav>
	{#if show_external_validation}
		<ExternalValidation />
	{:else}
		<AnalysticsTables assignment_name={selected_assignment} />
	{/if}
</div>

<style>
	.analytics-wrap {
		overflow-x: scroll;
	}

	.assignment-link {
		margin: 20px 0;
		cursor: pointer;
		padding: 7px 20px;
		white-space: nowrap;
	}

	.assignment-nav {
		padding: 20px 10px;
		width: 200px;
		background-color: #21293b;
	}

	.assignment-selected {
		border-left: 3px solid #fff;
	}
</style>
